import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ProjectStatus, ResetPasswordToken } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserWithPasswordResponseDto } from './dto/user-with-password.response-dto';
import { ConfigService } from '@nestjs/config';
import { MessageResponseDto } from './dto/message.response-dto';
import { MailService } from '../mail/mail.service';
import { UserResponseDto } from './dto/user.response-dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { TooManyRequestsException } from '../shared/exceptions/too-many-requests.exception';
import { RolesService } from '../roles/roles.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { CreateGoogleUserDto } from './dto/create-google-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapper } from '../shared/mappers/user.mapper';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ProjectsService } from '../projects/projects.service';
import { ProjectsListResponseDto } from '../projects/dto/projects-list.response-dto';
import { UsersListResponseDto } from './dto/users-list.response-dto';
import { ParticipationsService } from '../participations/participations.service';
import { ProjectParticipationResponseDto } from '../participations/dto/project-participation.response-dto';
import { LoggerService } from '../logger/logger.service';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { EmailValidationResponseDto } from './dto/email-validation.response-dto';
import { TokenValidationResponseDto } from './dto/token-validation.response-dto';
import { AuthResponseDto } from './dto/auth.response-dto';
import { EmailWithLocaleDto } from './dto/email-with-locale.dto';
import { EmailResponseDto } from './dto/email.response-dto';
import * as crypto from 'crypto';
import { CryptoTokenInterface } from '../shared/interfaces/crypto-token.interface';
import { LocaleType } from '../shared/types/locale.type';
import { ConfirmEmailWithLocaleDto } from './dto/confirm-email-with-locale.dto';

interface GetUsersOptionsInterface {
  activeProjectsCount: number;
  desiredRolesIds: string[];
  page: number;
  limit: number;
}

@Injectable()
export class UsersService {
  public constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private mailService: MailService,
    private rolesService: RolesService,
    private cloudinaryService: CloudinaryService,
    private projectsService: ProjectsService,
    private participationsService: ParticipationsService,
    private loggerService: LoggerService,
    private authService: AuthService,
  ) {}

  public async createUser(
    createUserDto: CreateUserDto,
    ip: string,
  ): Promise<UserResponseDto> {
    return this.prisma.$transaction(async (prisma) => {
      const role = await this.rolesService.findOrCreateRole('user', prisma);

      try {
        const user = await prisma.user.create({
          data: {
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            email: createUserDto.email,
            password: createUserDto.password,
            avatarUrl: this.cloudinaryService.getUrl('avatars/avatar_beta'),
            role: {
              connect: { id: role.id },
            },
          },
          include: {
            role: true,
            educations: true,
            socials: true,
            softSkills: true,
            hardSkills: true,
            desiredRoles: true,
          },
        });

        return UserMapper.toFullResponse(user, false);
      } catch (error) {
        if (error.code === 'P2002') {
          await this.loggerService.log(
            ip,
            createUserDto.email,
            'registration',
            'User with this email already exists',
          );
          throw new ConflictException('User with this email already exists');
        }

        await this.loggerService.log(
          ip,
          createUserDto.email,
          'registration',
          'Something went wrong. Please try again later',
        );

        throw error;
      }
    });
  }

  public async getUserByEmail(
    email: string,
    withPassword: boolean,
  ): Promise<UserWithPasswordResponseDto | UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        educations: true,
        socials: true,
        softSkills: true,
        hardSkills: true,
        desiredRoles: true,
      },
    });

    return user ? UserMapper.toFullResponse(user, withPassword) : null;
  }

  public async getUserById(id: string, mode: 'edit'): Promise<AuthResponseDto>;

  public async getUserById(id: string, mode: 'view'): Promise<UserResponseDto>;

  public async getUserById(
    id: string,
    mode: 'edit' | 'view',
  ): Promise<UserResponseDto | AuthResponseDto> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id },
        include: {
          role: true,
          educations: true,
          socials: true,
          softSkills: true,
          hardSkills: true,
          desiredRoles: true,
        },
      });

      return mode === 'edit'
        ? UserMapper.toAuthResponse(user)
        : UserMapper.toFullResponse(user, false);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  public async createVerificationEmailRecords(
    ip: string,
    user: AuthResponseDto,
    token: CryptoTokenInterface,
  ): Promise<void> {
    if (user.isVerified) {
      throw new BadRequestException('Email is confirmed');
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const recentTokens = await this.prisma.verificationToken.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: oneHourAgo },
      },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    });

    if (recentTokens.length >= 5) {
      const oldestOfFive = recentTokens[0];
      const nextAttemptAt = new Date(
        oldestOfFive.createdAt.getTime() + 60 * 60 * 1000,
      );

      await this.loggerService.log(
        ip,
        user.email,
        'confirmation email',
        'You have used up all your attempts. Please try again later.',
      );

      throw new TooManyRequestsException(
        'You have used up all your attempts. Please try again later.',
        recentTokens.length,
        nextAttemptAt,
      );
    }

    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.verificationToken.updateMany({
          where: {
            userId: user.id,
            used: false,
          },
          data: {
            used: true,
          },
        });

        await prisma.verificationToken.create({
          data: {
            userId: user.id,
            token: token.hashed,
            createdAt: token.createdAt,
          },
        });
      });
    } catch (error) {
      if (error.code === 'P2003') {
        await this.loggerService.log(
          ip,
          user.email,
          'confirmation email',
          'User with this email not found',
        );
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  public async sendConfirmationEmail(
    ip: string,
    locale: LocaleType,
    user: AuthResponseDto,
  ): Promise<MessageResponseDto> {
    const token = this.createCryptoToken();
    await this.createVerificationEmailRecords(ip, user, token);
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

    const user = UserMapper.toAuthResponse(record.user);
    const newToken = this.createCryptoToken();
    await this.createVerificationEmailRecords(ip, user, newToken);
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

        const accessToken = req.cookies['accessToken'];
        const refreshToken = req.cookies['refreshToken'];

        await this.authService.clearTokens(accessToken, refreshToken, res);

        return { message: 'Email verified successfully' };
      } catch (error) {
        if (error.code === 'P2025') {
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
          error.message,
        );
        throw error;
      }
    }
  }

  public async sendPasswordResetUrl(
    ip: string,
    emailDto: EmailWithLocaleDto,
  ): Promise<string> {
    const token = this.createCryptoToken();
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

    return record.id;
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

      await this.loggerService.log(
        ip,
        email,
        'reset password',
        'You have used up all your attempts. Please try again later',
      );

      throw new TooManyRequestsException(
        'You have used up all your attempts. Please try again later.',
        attempts.length,
        nextAttemptAt,
      );
    }

    return this.prisma.$transaction(async (prisma) => {
      const resetPasswordToken = await prisma.resetPasswordToken.upsert({
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

      await prisma.resetPasswordAttempt.create({
        data: {
          ip,
          createdAt: token.createdAt,
        },
      });

      return resetPasswordToken;
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
      await this.loggerService.log(ip, '', 'reset password', error.message);

      if (error.code === 'P2025') {
        throw new BadRequestException('Invalid or expired token');
      }
      throw error;
    }
  }

  public async createOrUpdateGoogleUser(
    createGoogleUserDto: CreateGoogleUserDto,
  ): Promise<{ user: UserResponseDto; authType: 'registration' | 'login' }> {
    const user = await this.getUserByEmail(createGoogleUserDto.email, false);
    let updatedUser: UserResponseDto;
    let authType: 'registration' | 'login';

    if (!user) {
      authType = 'registration';
      const role = await this.rolesService.findOrCreateRole('user');
      const userFromDB = await this.prisma.user.create({
        data: {
          firstName: createGoogleUserDto.firstName,
          lastName: createGoogleUserDto.lastName,
          email: createGoogleUserDto.email,
          googleId: createGoogleUserDto.googleId,
          avatarUrl: this.cloudinaryService.getUrl('avatars/avatar_beta'),
          isVerified: true,
          role: {
            connect: { id: role.id },
          },
        },
        include: {
          role: true,
          educations: true,
          socials: true,
          softSkills: true,
          hardSkills: true,
          desiredRoles: true,
        },
      });
      updatedUser = UserMapper.toFullResponse(userFromDB, false);
    } else if (user && !user.googleId) {
      authType = user.isVerified ? 'login' : 'registration';
      const userFromDB = await this.prisma.user.update({
        where: { email: createGoogleUserDto.email },
        data: { googleId: createGoogleUserDto.googleId, isVerified: true },
        include: {
          role: true,
          educations: true,
          socials: true,
          softSkills: true,
          hardSkills: true,
          desiredRoles: true,
        },
      });
      updatedUser = UserMapper.toFullResponse(userFromDB, false);
    } else {
      updatedUser = user;
      authType = 'login';
    }

    return { user: updatedUser, authType };
  }

  public async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<AuthResponseDto> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          firstName: updateUserDto.firstName,
          lastName: updateUserDto.lastName,
          desiredRoles: {
            set: updateUserDto.desiredRolesIds.map((roleId) => ({
              id: roleId,
            })),
          },
        },
        include: {
          role: true,
          desiredRoles: true,
        },
      });

      return UserMapper.toAuthResponse(updatedUser);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  public async updateEmail(
    id: string,
    ip: string,
    emailDto: EmailWithLocaleDto,
  ): Promise<AuthResponseDto> {
    try {
      const user = await this.getUserById(id, 'edit');
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: { email: emailDto.email },
        include: {
          role: true,
          desiredRoles: true,
        },
      });

      if (user.email !== updatedUser.email) {
        const token = this.createCryptoToken();
        await this.createVerificationEmailRecords(ip, updatedUser, token);
        const params = new URLSearchParams({
          token: token.raw,
          email: updatedUser.email,
        });
        const url = `${this.configService.get('BASE_FRONTEND_URL')}/verify-email?${params.toString()}`;

        await this.mailService.sendVerificationMail(
          updatedUser.email,
          url,
          emailDto.locale,
        );
      }

      return UserMapper.toAuthResponse(updatedUser);
    } catch (error) {
      switch (error.code) {
        case 'P2025':
          throw new NotFoundException('User not found');
        case 'P2002':
          throw new ConflictException('Email is already in use');
        default:
          throw error;
      }
    }
  }

  public async getUserProjects(
    userId: string,
    page = 1,
    limit = 20,
    status?: ProjectStatus,
  ): Promise<ProjectsListResponseDto> {
    return this.projectsService.getProjects({ userId, page, limit, status });
  }

  public async getUsers(
    options: Partial<GetUsersOptionsInterface>,
  ): Promise<UsersListResponseDto> {
    const {
      activeProjectsCount,
      desiredRolesIds,
      page = 1,
      limit = 20,
    } = options;

    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      isVerified: true,
      ...(desiredRolesIds?.length
        ? {
            desiredRoles: {
              some: {
                id: { in: desiredRolesIds },
              },
            },
          }
        : {}),
      ...(typeof activeProjectsCount === 'number'
        ? {
            activeProjectsCount: activeProjectsCount,
          }
        : {}),
    };

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        include: {
          desiredRoles: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      total,
      users: users.map((user) => UserMapper.toCardResponse(user)),
    };
  }

  public async getInvites(
    userId: string,
    ownerId?: string,
  ): Promise<ProjectParticipationResponseDto[]> {
    return this.participationsService.getInvitesWithProjects(userId, ownerId);
  }

  public async getRequests(
    userId: string,
    ownerId?: string,
  ): Promise<ProjectParticipationResponseDto[]> {
    return this.participationsService.getRequestsWithProjects(userId, ownerId);
  }

  public async linkDiscord(id: string, discordId: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id },
        data: { discordId },
        include: {
          role: true,
          educations: true,
          socials: true,
          softSkills: true,
          hardSkills: true,
          desiredRoles: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  public async checkEmailAvailable(
    email: string,
  ): Promise<EmailValidationResponseDto> {
    const user = await this.getUserByEmail(email, false);
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
      const user = await this.getUserByEmail(resetPasswordToken.email, false);
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
      if (error.code === 'P2025') {
        throw new NotFoundException('Token not found');
      }
      throw error;
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
      if (error.code === 'P2025') {
        throw new NotFoundException('Token not found');
      }
      throw error;
    }
  }

  public createCryptoToken(): CryptoTokenInterface {
    const raw = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash('sha256').update(raw).digest('hex');
    const createdAt = new Date();
    return { raw, hashed, createdAt };
  }
}
