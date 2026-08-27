import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthWithPasswordResponseDto } from '../users/dto/auth-with-password.response-dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { TooManyRequestsException } from '../common/exceptions/too-many-requests.exception';
import { RedisService } from '../redis/redis.service';
import { MessageResponseDto } from '../users/dto/message.response-dto';
import { LoggerService } from '../logger/logger.service';
import { DiscordService } from '../discord/discord.service';
import { AuthResponseDto } from '../users/dto/auth.response-dto';
import { localeArray, LocaleType } from '../common/types/locale.type';
import { TokenPayloadInterface } from '../common/interfaces/token-payload.interface';
import { CookieConfigService } from '../cookie-config/cookie-config.service';
import { CsrfService } from '../csrf/csrf.service';
import { UserMapper } from '../common/mappers/user.mapper';
import { isPrismaError } from '../common/utils/is-prisma-error';
import { throwPrismaError } from '../common/utils/throw-prisma-error';
import { CryptoTokenInterface } from '../common/interfaces/crypto-token.interface';
import { ResetPasswordToken } from '@prisma/client';
import { ConfirmEmailWithLocaleDto } from '../users/dto/confirm-email-with-locale.dto';
import * as crypto from 'crypto';
import { ConfirmEmailDto } from '../users/dto/confirm-email.dto';
import { EmailWithLocaleDto } from '../users/dto/email-with-locale.dto';
import { IdResponseDto } from '../users/dto/id.response-dto';
import { ResetPasswordDto } from '../users/dto/reset-password.dto';
import { EmailValidationResponseDto } from '../users/dto/email-validation.response-dto';
import { TokenValidationResponseDto } from '../users/dto/token-validation.response-dto';
import { EmailResponseDto } from '../users/dto/email.response-dto';

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly loggerService: LoggerService,
    private readonly discordService: DiscordService,
    private readonly cookieService: CookieConfigService,
    private readonly csrfService: CsrfService,
  ) {}

  public async validateUser(
    req: Request,
    loginDto: LoginDto,
  ): Promise<AuthResponseDto> {
    const user = (await this.usersService.getUserByEmail(
      loginDto.email,
      true,
    )) as AuthWithPasswordResponseDto | null;
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

      return user;
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
    this.csrfService.rotate(req, res);

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
    req: Request,
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

    const { accessToken, refreshToken } = await this.createTokens(user.id);
    this.addRefreshTokenToResponse(res, refreshToken);
    this.addAccessTokenToResponse(res, accessToken);
    this.csrfService.rotate(req, res);

    return user;
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
      this.cookieService.expireSecRefreshToken,
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
    res.cookie(
      this.cookieService.refreshTokenCookieName,
      refreshToken,
      this.cookieService.refreshCookieOptions,
    );
  }

  private addAccessTokenToResponse(res: Response, accessToken: string): void {
    res.cookie(
      this.cookieService.accessTokenCookieName,
      accessToken,
      this.cookieService.accessCookieOptions,
    );
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
    const token = req.cookies[this.cookieService.refreshTokenCookieName];
    const userId = await this.validateRefreshToken(token);
    const { accessToken, refreshToken } = await this.createTokens(userId);
    this.addRefreshTokenToResponse(res, refreshToken);
    this.addAccessTokenToResponse(res, accessToken);
  }

  public async clearTokens(
    refreshToken: string,
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const payload = this.jwtService.verify<TokenPayloadInterface>(
        refreshToken,
        { secret: this.configService.get<string>('JWT_REFRESH_SECRET') },
      );

      await this.redisService.del(payload.jti);
    } catch (error) {
      if (!(
        error instanceof TokenExpiredError || error instanceof JsonWebTokenError
      )) {
        throw error;
      }
    } finally {
      res.clearCookie(
        this.cookieService.refreshTokenCookieName,
        this.cookieService.baseCookieOptions,
      );
      res.clearCookie(
        this.cookieService.accessTokenCookieName,
        this.cookieService.baseCookieOptions,
      );
      this.csrfService.rotate(req, res);
    }
  }

  public async logout(
    ip: string,
    req: Request,
    res: Response,
  ): Promise<MessageResponseDto> {
    const refreshToken = req.cookies[this.cookieService.refreshTokenCookieName];
    const user = req.user as AuthResponseDto;

    try {
      await this.clearTokens(refreshToken, req, res);

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
    this.csrfService.rotate(req, res);

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

      this.csrfService.rotate(req, res);

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

  public async sendConfirmationEmail(
    ip: string,
    locale: LocaleType,
    user: AuthResponseDto,
  ): Promise<MessageResponseDto> {
    const token = this.usersService.createCryptoToken();
    await this.usersService.createVerificationEmailRecords(ip, user, token);
    const params = new URLSearchParams({
      token: token.raw,
    });
    const url = `${this.configService.get('BASE_FRONTEND_URL')}/verify-email?${params.toString()}`;

    await this.mailService.sendVerificationMail(user.email, url, locale);

    await this.loggerService.log(
      ip,
      user.email,
      'confirmation email',
      'Confirmation email sent successfully',
    );

    return { message: 'Confirmation email sent. Please check your inbox.' };
  }

  public async resendConfirmationEmail(
    ip: string,
    confirmEmailWithLocaleDto: ConfirmEmailWithLocaleDto,
  ): Promise<MessageResponseDto> {
    const { token, locale } = confirmEmailWithLocaleDto;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const record = await this.prisma.verificationToken.findUnique({
      where: { token: hashedToken },
      include: {
        user: {
          include: {
            role: true,
            desiredRoles: true,
          },
        },
      },
    });

    if (!record) {
      throw new NotFoundException('Token not found');
    }

    const user = UserMapper.toAuthResponse(record.user, false);
    const newToken = this.usersService.createCryptoToken();
    await this.usersService.createVerificationEmailRecords(ip, user, newToken);
    const params = new URLSearchParams({
      token: newToken.raw,
    });
    const url = `${this.configService.get('BASE_FRONTEND_URL')}/verify-email?${params.toString()}`;

    await this.mailService.sendVerificationMail(user.email, url, locale);

    await this.loggerService.log(
      ip,
      record.user.email,
      'confirmation email',
      'Confirmation email sent successfully',
    );

    return { message: 'Confirmation email sent. Please check your inbox.' };
  }

  public async confirmEmail(
    ip: string,
    confirmEmailDto: ConfirmEmailDto,
    req: Request,
    res: Response,
  ): Promise<MessageResponseDto> {
    const { token } = confirmEmailDto;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const verificationToken = await this.prisma.verificationToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!verificationToken) {
      await this.loggerService.log(
        ip,
        '',
        'confirmation email',
        'Token not found',
      );
      throw new NotFoundException('Token not found');
    } else if (verificationToken.used) {
      await this.loggerService.log(
        ip,
        verificationToken.user.email,
        'confirmation email',
        'Token expired',
      );
      throw new BadRequestException('Token expired');
    } else {
      try {
        await this.prisma.$transaction(async (prisma) => {
          await prisma.verificationToken.deleteMany({
            where: { userId: verificationToken.userId },
          });

          await prisma.user.update({
            where: { id: verificationToken.userId },
            data: { isVerified: true },
          });

          await this.loggerService.log(
            ip,
            verificationToken.user.email,
            'confirmation email',
            'Email verified successfully',
          );
        });

        const refreshToken = req.cookies['refreshToken'];

        await this.clearTokens(refreshToken, req, res);

        return { message: 'Email verified successfully' };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (isPrismaError(error) && error.code === 'P2025') {
          await this.loggerService.log(
            ip,
            verificationToken.user.email,
            'confirmation email',
            'User not found',
          );
          throw new NotFoundException('User not found');
        }
        await this.loggerService.log(
          ip,
          verificationToken.user.email,
          'confirmation email',
          message,
        );
        throw error;
      }
    }
  }

  public async sendPasswordResetUrl(
    ip: string,
    emailDto: EmailWithLocaleDto,
  ): Promise<IdResponseDto> {
    const token = this.usersService.createCryptoToken();
    const record = await this.createPasswordResetRecords(
      ip,
      emailDto.email,
      token,
    );
    const params = new URLSearchParams({
      token: token.raw,
    });
    const url = `${this.configService.get('BASE_FRONTEND_URL')}/reset-password?${params.toString()}`;

    await this.mailService.sendResetPasswordMail(
      emailDto.email,
      url,
      emailDto.locale,
    );

    await this.loggerService.log(
      ip,
      emailDto.email,
      'reset password',
      'Password reset link sent successfully',
    );

    return { id: record.id };
  }

  public async createPasswordResetRecords(
    ip: string,
    email: string,
    token: CryptoTokenInterface,
  ): Promise<ResetPasswordToken> {
    const attempts = await this.prisma.resetPasswordAttempt.findMany({
      where: { ip },
      orderBy: { createdAt: 'asc' },
      take: 5,
    });

    if (attempts.length >= 5) {
      const oldestAttempt = attempts[0];
      const nextAttemptAt = new Date(
        oldestAttempt.createdAt.getTime() + 60 * 60 * 1000,
      );

      throw new TooManyRequestsException(
        'You have used up all your attempts. Please try again later.',
        attempts.length,
        nextAttemptAt,
      );
    }

    await this.prisma.resetPasswordAttempt.create({
      data: {
        ip,
        createdAt: new Date(),
      },
    });

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isBlocked) {
      throw new ForbiddenException('User is blocked');
    }

    return this.prisma.resetPasswordToken.upsert({
      where: { email },
      update: {
        token: token.hashed,
        createdAt: token.createdAt,
      },
      create: {
        email,
        token: token.hashed,
        createdAt: token.createdAt,
      },
    });
  }

  public async resetPassword(
    ip: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<MessageResponseDto> {
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetPasswordDto.token)
      .digest('hex');

    const resetPasswordToken = await this.prisma.resetPasswordToken.findUnique({
      where: { token: hashedToken },
    });

    if (!resetPasswordToken) {
      await this.loggerService.log(
        ip,
        '',
        'reset password',
        'Invalid or expired token',
      );
      throw new BadRequestException('Invalid or expired token');
    }

    try {
      await this.prisma.$transaction(async (prisma) => {
        const email = resetPasswordToken.email;
        const hashPassword = await bcrypt.hash(resetPasswordDto.password, 10);

        const user = await prisma.user.update({
          where: { email: resetPasswordToken.email },
          data: { password: hashPassword },
        });
        await prisma.resetPasswordToken.delete({ where: { email } });

        await this.loggerService.log(
          ip,
          user.email,
          'reset password',
          'Password reset successfully',
        );
      });

      return { message: 'Password has been reset successfully.' };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await this.loggerService.log(ip, '', 'reset password', message);

      if (isPrismaError(error) && error.code === 'P2025') {
        throw new BadRequestException('Invalid or expired token');
      }
      throw error;
    }
  }

  public async updateEmail(
    id: string,
    ip: string,
    emailDto: EmailWithLocaleDto,
  ): Promise<AuthResponseDto> {
    return this.usersService.updateEmail(id, ip, emailDto);
  }

  public async checkEmailAvailable(
    email: string,
  ): Promise<EmailValidationResponseDto> {
    const user = await this.usersService.getUserByEmail(email, false);
    return { isAvailable: !user, isConfirmed: !!user?.isVerified };
  }

  public async validateToken(
    token: string,
  ): Promise<TokenValidationResponseDto> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
      const resetPasswordToken =
        await this.prisma.resetPasswordToken.findUniqueOrThrow({
          where: { token: hashedToken },
        });
      const user = await this.usersService.getUserByEmail(
        resetPasswordToken.email,
        false,
      );
      return user
        ? {
            isValid: true,
            firstName: user.firstName,
            lastName: user.lastName,
          }
        : { isValid: false };
    } catch {
      return { isValid: false };
    }
  }

  public async cancelResetPassword(token: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
      await this.prisma.resetPasswordToken.delete({
        where: { token: hashedToken },
      });
    } catch (error) {
      throwPrismaError(error, {
        code: 'P2025',
        exception: NotFoundException,
        message: 'Token not found',
      });
    }
  }

  public async getPasswordResetToken(id: string): Promise<EmailResponseDto> {
    try {
      const token = await this.prisma.resetPasswordToken.findUniqueOrThrow({
        where: { id },
      });
      return {
        id,
        email: token.email,
      };
    } catch (error) {
      throwPrismaError(error, {
        code: 'P2025',
        exception: NotFoundException,
        message: 'Token not found',
      });
    }
  }
}
