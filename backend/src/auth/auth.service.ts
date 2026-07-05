import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { UserWithPasswordResponseDto } from '../users/dto/user-with-password.response-dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { TooManyRequestsException } from '../shared/exceptions/too-many-requests.exception';
import { RedisService } from '../redis/redis.service';
import { MessageResponseDto } from '../users/dto/message.response-dto';
import { LoggerService } from '../logger/logger.service';
import { DiscordService } from '../discord/discord.service';
import { AuthResponseDto } from '../users/dto/auth.response-dto';
import { localeArray, LocaleType } from '../shared/types/locale.type';
import { TokenPayloadInterface } from '../shared/interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  private EXPIRE_DAY_REFRESH_TOKEN = 1;

  private EXPIRE_MINUTES_ACCESS_TOKEN = 5;

  private REFRESH_TOKEN_NAME = 'refreshToken';

  private ACCESS_TOKEN_NAME = 'accessToken';

  public constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private mailService: MailService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private redisService: RedisService,
    private loggerService: LoggerService,
    private discordService: DiscordService,
  ) {}

  public async validateUser(
    req: Request,
    loginDto: LoginDto,
  ): Promise<AuthResponseDto> {
    const user = (await this.usersService.getUserByEmail(
      loginDto.email,
      true,
    )) as UserWithPasswordResponseDto | null;
    const ip =
      req.ip ??
      req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ??
      req.socket.remoteAddress;

    if (!user) {
      await this.loggerService.log(
        ip ?? 'unknown',
        loginDto.email,
        'login',
        'Email or password is incorrect',
      );
      throw new UnauthorizedException('Email or password is incorrect');
    }

    if (user.isBlocked) {
      await this.loggerService.log(
        ip ?? 'unknown',
        loginDto.email,
        'login',
        'User is blocked',
      );

      throw new ForbiddenException('User is blocked');
    }

    const loginAttempt = await this.prisma.loginAttempt.findUnique({
      where: { userId: user.id },
    });

    if (loginAttempt) {
      const now = new Date();
      if (loginAttempt.blockedUntil && now < loginAttempt.blockedUntil) {
        await this.loggerService.log(
          ip ?? 'unknown',
          loginDto.email,
          'login',
          'Too many failed attempts. Please try again later',
        );
        throw new TooManyRequestsException(
          'Too many failed attempts. Please try again later',
          loginAttempt.attemptsCount,
          loginAttempt.blockedUntil,
        );
      }
    }

    const passwordEquals = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (passwordEquals) {
      if (loginAttempt) {
        await this.prisma.loginAttempt.delete({
          where: { userId: user.id },
        });
      }
      const {
        password,
        educations,
        socials,
        hardSkills,
        softSkills,
        ...baseUserInfo
      } = user;
      return baseUserInfo;
    } else {
      if (loginAttempt) {
        const attemptsCount = loginAttempt.attemptsCount + 1;
        const updateData: {
          attemptsCount: number;
          blockedUntil?: Date;
        } = {
          attemptsCount,
        };

        if (attemptsCount === 5) {
          updateData.blockedUntil = new Date(
            new Date().getTime() + 15 * 60 * 1000,
          );
        }

        if (attemptsCount === 10) {
          updateData.blockedUntil = new Date(
            new Date().getTime() + 60 * 60 * 1000,
          );
        }

        if (attemptsCount === 15) {
          await this.prisma.$transaction([
            this.prisma.loginAttempt.update({
              where: {
                userId: user.id,
              },
              data: {
                attemptsCount: attemptsCount,
                blockedUntil: null,
              },
            }),

            this.prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                isBlocked: true,
              },
            }),
          ]);

          await this.loggerService.log(
            ip ?? 'unknown',
            loginDto.email,
            'login',
            'User has been blocked due to too many failed attempts',
          );

          throw new ForbiddenException('User is blocked');
        }

        await this.prisma.loginAttempt.update({
          where: { userId: user.id },
          data: updateData,
        });

        if ([5, 10].includes(updateData.attemptsCount)) {
          await this.loggerService.log(
            ip ?? 'unknown',
            loginDto.email,
            'login',
            'Too many failed attempts. Please try again later',
          );
          throw new TooManyRequestsException(
            'Too many failed attempts. Please try again later',
            updateData.attemptsCount,
            updateData.blockedUntil,
          );
        }
      } else {
        await this.prisma.loginAttempt.create({
          data: {
            userId: user.id,
            attemptsCount: 1,
          },
        });
      }

      await this.loggerService.log(
        ip ?? 'unknown',
        loginDto.email,
        'login',
        'Email or password is incorrect',
      );
      throw new UnauthorizedException('Email or password is incorrect');
    }
  }

  public async login(
    ip: string,
    req: Request,
    res: Response,
  ): Promise<AuthResponseDto> {
    const user: AuthResponseDto = req.user as AuthResponseDto;
    const { accessToken, refreshToken } = await this.createTokens(user.id);
    this.addRefreshTokenToResponse(res, refreshToken);
    this.addAccessTokenToResponse(res, accessToken);

    await this.loggerService.log(
      ip,
      user.email,
      'login',
      'User login successfully',
    );

    return user;
  }

  public async registration(
    createUserDto: CreateUserDto,
    ip: string,
    res: Response,
  ): Promise<AuthResponseDto> {
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.createUser(
      {
        ...createUserDto,
        password: hashPassword,
      },
      ip,
    );

    await this.loggerService.log(
      ip,
      createUserDto.email,
      'registration',
      'User registered successfully',
    );

    const { accessToken, refreshToken } = await this.createTokens(user.id);
    this.addRefreshTokenToResponse(res, refreshToken);
    this.addAccessTokenToResponse(res, accessToken);
    const token = this.usersService.createCryptoToken();
    await this.usersService.createVerificationEmailRecords(ip, user, token);
    const params = new URLSearchParams({
      token: token.raw,
    });
    const url = `${this.configService.get('BASE_FRONTEND_URL')}/verify-email?${params.toString()}`;

    await this.mailService.sendVerificationMail(
      createUserDto.email,
      url,
      createUserDto.locale,
    );

    const { educations, socials, hardSkills, softSkills, ...baseUserInfo } =
      user;

    return baseUserInfo;
  }

  private createAccessToken(userId: string): string {
    const data: TokenPayloadInterface = {
      sub: userId,
      jti: crypto.randomUUID(),
    };

    return this.jwtService.sign(data, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('EXPIRE_TIME_ACCESS_TOKEN'),
    });
  }

  private async createRefreshToken(userId: string): Promise<string> {
    const data: TokenPayloadInterface = {
      sub: userId,
      jti: crypto.randomUUID(),
    };

    await this.redisService.addToWhitelist(
      data.jti,
      this.EXPIRE_DAY_REFRESH_TOKEN * 24 * 3600,
    );

    return this.jwtService.sign(data, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('EXPIRE_TIME_REFRESH_TOKEN'),
    });
  }

  private async createTokens(userId: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessToken = this.createAccessToken(userId);
    const refreshToken = await this.createRefreshToken(userId);

    return {
      accessToken,
      refreshToken,
    };
  }

  private addRefreshTokenToResponse(res: Response, refreshToken: string): void {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      expires: expiresIn,
      secure: true,
      sameSite: 'lax',
    });
  }

  private addAccessTokenToResponse(res: Response, accessToken: string): void {
    const expiresIn = new Date();
    expiresIn.setMinutes(
      expiresIn.getMinutes() + this.EXPIRE_MINUTES_ACCESS_TOKEN,
    );

    res.cookie(this.ACCESS_TOKEN_NAME, accessToken, {
      httpOnly: true,
      expires: expiresIn,
      secure: true,
      sameSite: 'lax',
    });
  }

  private async validateRefreshToken(refreshToken: string): Promise<string> {
    try {
      const payload = this.jwtService.verify<TokenPayloadInterface>(
        refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );
      const isValid = await this.redisService.isTokenValid(payload.jti);

      if (!isValid) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      await this.redisService.del(payload.jti);
      return payload.sub;
    } catch (error) {
      if (
        error instanceof TokenExpiredError ||
        error instanceof JsonWebTokenError
      ) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
      throw error;
    }
  }

  public async regenerateTokens(req: Request, res: Response): Promise<void> {
    const token = req.cookies['refreshToken'];
    const userId = await this.validateRefreshToken(token);
    const { accessToken, refreshToken } = await this.createTokens(userId);
    this.addRefreshTokenToResponse(res, refreshToken);
    this.addAccessTokenToResponse(res, accessToken);
  }

  public async clearTokens(refreshToken: string, res: Response): Promise<void> {
    try {
      const payload = this.jwtService.verify<TokenPayloadInterface>(
        refreshToken,
        { secret: this.configService.get<string>('JWT_REFRESH_SECRET') },
      );

      await this.redisService.del(payload.jti);
    } catch (error) {
      if (
        !(
          error instanceof TokenExpiredError ||
          error instanceof JsonWebTokenError
        )
      ) {
        throw error;
      }
    } finally {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });
    }
  }

  public async logout(
    ip: string,
    req: Request,
    res: Response,
  ): Promise<MessageResponseDto> {
    const refreshToken = req.cookies['refreshToken'];
    const user = req.user as AuthResponseDto;

    try {
      await this.clearTokens(refreshToken, res);

      await this.loggerService.log(
        ip,
        user.email,
        'logout',
        'Logged out successfully',
      );
      return { message: 'Logged out successfully' };
    } catch (error) {
      await this.loggerService.log(
        ip,
        user.email,
        'logout',
        'Something went wrong',
      );
      throw error;
    }
  }

  public async googleLogin(
    ip: string,
    req: Request,
    res: Response,
  ): Promise<'registration' | 'login'> {
    if (!req.user) {
      await this.loggerService.log(
        ip,
        'unknown',
        'google authentication',
        'Google authentication failed',
      );
      throw new UnauthorizedException('Google authentication failed');
    }

    const reqUser = req.user as {
      googleId: string;
      firstName: string;
      lastName: string;
      email: string;
      picture: string;
      accessToken: string;
      refreshToken: string;
    };

    const { user, authType } =
      await this.usersService.createOrUpdateGoogleUser(reqUser);
    const { accessToken, refreshToken } = await this.createTokens(user.id);
    this.addRefreshTokenToResponse(res, refreshToken);
    this.addAccessTokenToResponse(res, accessToken);

    await this.loggerService.log(
      ip,
      'unknown',
      'google authentication',
      'Google authentication successfully',
    );

    return authType;
  }

  public async handleDiscordCallback(
    req: Request,
    res: Response,
    state: string,
    error?: string,
  ): Promise<void> {
    const frontendBaseUrl =
      this.configService.get<string>('BASE_FRONTEND_URL') ??
      'https://localhost:3000';

    try {
      const data = await this.redisService.get(state);
      if (!data) {
        const fallbackReturnUrl = this.getSafeReturnUrl('/', 'ua', {
          social: 'discord',
          status: 'failure',
          error,
        });
        const fallbackRedirect = `${frontendBaseUrl}${fallbackReturnUrl}`;
        return res.redirect(fallbackRedirect);
      }

      const { userId, returnUrl, locale } = JSON.parse(data);
      const { discordId, accessToken } = req.user as {
        discordId: string;
        accessToken: string;
      };

      await this.discordService.addToGuild(discordId, accessToken);
      await this.usersService.linkDiscord(userId, discordId);
      await this.redisService.del(state);

      const safeReturnUrl = error
        ? this.getSafeReturnUrl(returnUrl, locale, {
            social: 'discord',
            status: 'failure',
            error,
          })
        : this.getSafeReturnUrl(returnUrl, locale, {
            social: 'discord',
            status: 'success',
          });

      const redirectUrl = `${frontendBaseUrl}${safeReturnUrl}`;

      await this.redisService.del(state);

      return res.redirect(redirectUrl);
    } catch {
      const data = await this.redisService.get(state);
      const { returnUrl, locale } = data
        ? JSON.parse(data)
        : { returnUrl: '/', locale: 'ua' };
      const safeReturnUrl = this.getSafeReturnUrl(returnUrl, locale, {
        social: 'discord',
        status: 'failure',
        error: error ?? 'discord_auth_failed',
      });

      const redirectUrl = `${frontendBaseUrl}${safeReturnUrl}`;
      return res.redirect(redirectUrl);
    }
  }

  public async handleDiscordCancel(
    res: Response,
    state: string,
  ): Promise<void> {
    const frontendBaseUrl =
      this.configService.get<string>('BASE_FRONTEND_URL') ??
      'https://localhost:3000';

    try {
      const data = await this.redisService.get(state);
      const { returnUrl, locale } = data
        ? JSON.parse(data)
        : { returnUrl: '/', locale: 'ua' };
      const safeReturnUrl = this.getSafeReturnUrl(returnUrl, locale, {
        social: 'discord',
        status: 'cancel',
      });

      await this.redisService.del(state);

      const redirectUrl = `${frontendBaseUrl}${safeReturnUrl}`;
      return res.redirect(redirectUrl);
    } catch {
      return res.redirect('/');
    }
  }

  public async handleGoogleCallback(
    ip: string,
    req: Request,
    res: Response,
    state: string,
    error?: string,
  ): Promise<void> {
    const frontendBaseUrl =
      this.configService.get<string>('BASE_FRONTEND_URL') ??
      'https://localhost:3000';

    try {
      const data = await this.redisService.get(state);
      const authType = await this.googleLogin(ip, req, res);
      const { returnUrl, locale } = data
        ? JSON.parse(data)
        : { returnUrl: '/', locale: 'ua' };
      const safeReturnUrl = error
        ? this.getSafeReturnUrl(returnUrl, locale, {
            social: 'google',
            status: 'failure',
            error,
          })
        : this.getSafeReturnUrl(returnUrl, locale, {
            social: 'google',
            status: 'success',
            authType,
          });
      console.log(returnUrl, safeReturnUrl);

      const redirectUrl = `${frontendBaseUrl}${safeReturnUrl}`;

      await this.redisService.del(state);

      return res.redirect(redirectUrl);
    } catch {
      const data = await this.redisService.get(state);
      const { returnUrl, locale } = data
        ? JSON.parse(data)
        : { returnUrl: '/', locale: 'ua' };
      const safeReturnUrl = this.getSafeReturnUrl(returnUrl, locale, {
        social: 'google',
        status: 'failure',
        error: error ?? 'google_auth_failed',
      });

      const redirectUrl = `${frontendBaseUrl}${safeReturnUrl}`;
      return res.redirect(redirectUrl);
    }
  }

  public async handleGoogleCancel(
    ip: string,
    res: Response,
    state: string,
  ): Promise<void> {
    const frontendBaseUrl =
      this.configService.get<string>('BASE_FRONTEND_URL') ??
      'https://localhost:3000';

    try {
      const data = await this.redisService.get(state);
      const { returnUrl, locale } = data
        ? JSON.parse(data)
        : { returnUrl: '/', locale: 'ua' };
      const safeReturnUrl = this.getSafeReturnUrl(returnUrl, locale, {
        social: 'google',
        status: 'cancel',
      });

      await this.loggerService.log(
        ip,
        'unknown',
        'google authentication',
        'Google authentication canceled',
      );
      await this.redisService.del(state);

      const redirectUrl = `${frontendBaseUrl}${safeReturnUrl}`;
      return res.redirect(redirectUrl);
    } catch {
      return res.redirect('/');
    }
  }

  private getSafeReturnUrl(
    url: string | undefined,
    locale: LocaleType | undefined,
    data: {
      social: 'discord' | 'google';
      status: 'success' | 'failure' | 'cancel';
      error?: string;
      authType?: 'login' | 'registration';
    },
  ): string {
    try {
      const decodedUrl = decodeURIComponent(url ?? '');

      if (!locale || !localeArray.includes(locale)) {
        locale = 'ua';
      }

      if (!decodedUrl.startsWith('/')) {
        return `/${locale}`;
      }

      const urlObj = new URL(decodedUrl, 'http://dummy');

      let finalPath = '';

      if (data.social === 'google' && data.status === 'success') {
        const next = urlObj.searchParams.get('next');

        if (next) {
          const decodedNext = decodeURIComponent(next);

          if (decodedNext.startsWith('/')) {
            const nextUrlObj = new URL(decodedNext, 'http://dummy');

            this.appendParams(nextUrlObj, data);

            finalPath = `${nextUrlObj.pathname}${nextUrlObj.search}`;
          }
        } else {
          finalPath = '/';
        }
      }

      if (!finalPath) {
        this.appendParams(urlObj, data);

        finalPath = `${urlObj.pathname}${urlObj.search}`;
      }

      return `/${locale}${finalPath}`;
    } catch {
      return '/ua';
    }
  }

  private appendParams(
    urlObj: URL,
    data: {
      social: 'discord' | 'google';
      status: 'success' | 'failure' | 'cancel';
      error?: string;
      authType?: 'login' | 'registration';
    },
  ): void {
    if (data.status !== 'cancel') {
      urlObj.searchParams.set('status', data.status);
      urlObj.searchParams.set('social', data.social);
    }

    if (data.status === 'success' && data.social === 'google') {
      if (data.authType) {
        urlObj.searchParams.set('authType', data.authType);
      }
    }

    if (data.status === 'failure' && data.error) {
      urlObj.searchParams.set('error', data.error);
    }
  }
}
