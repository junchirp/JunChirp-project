import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserWithPasswordResponseDto } from './dto/user-with-password.response-dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { UserResponseDto } from './dto/user.response-dto';
import { TooManyRequestsException } from '../common/exceptions/too-many-requests.exception';
import { RolesService } from '../roles/roles.service';
import { CreateGoogleUserDto } from './dto/create-google-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapper } from '../common/mappers/user.mapper';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UsersListResponseDto } from './dto/users-list.response-dto';
import { LoggerService } from '../logger/logger.service';
import { AuthResponseDto } from './dto/auth.response-dto';
import { EmailWithLocaleDto } from './dto/email-with-locale.dto';
import * as crypto from 'crypto';
import { CryptoTokenInterface } from '../common/interfaces/crypto-token.interface';
import { isPrismaError } from '../common/utils/is-prisma-error';
import { CountResponseDto } from './dto/count.response-dto';
import { throwPrismaError } from '../common/utils/throw-prisma-error';

interface GetUsersOptionsInterface {
  activeProjectsCount: number;
  desiredRolesIds: string[];
  page: number;
  limit: number;
}

@Injectable()
export class UsersService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly rolesService: RolesService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly loggerService: LoggerService,
  ) {}

  public async createUser(
    createUserDto: CreateUserDto,
    ip: string,
  ): Promise<UserResponseDto> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const role = await this.rolesService.findOrCreateRole('user', prisma);

        const user = await prisma.user.create({
          data: {
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            email: createUserDto.email,
            password: createUserDto.password,
            avatarUrl: this.cloudinaryService.getUrl('avatars/avatar_beta'),
            role: {
              connect: {
                id: role.id,
              },
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
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2002') {
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
      throwPrismaError(error, {
        code: 'P2025',
        exception: NotFoundException,
        message: 'User not found',
      });
    }
  }

  public async createVerificationEmailRecords(
    ip: string,
    user: AuthResponseDto,
    token: CryptoTokenInterface,
    px?: Prisma.TransactionClient,
  ): Promise<void> {
    const prisma = px ?? this.prisma;
    if (user.isVerified) {
      throw new BadRequestException('Email is confirmed');
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const recentTokens = await prisma.verificationToken.findMany({
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
      await prisma.$transaction(async (pr) => {
        await pr.verificationToken.updateMany({
          where: {
            userId: user.id,
            used: false,
          },
          data: {
            used: true,
          },
        });

        await pr.verificationToken.create({
          data: {
            userId: user.id,
            token: token.hashed,
            createdAt: token.createdAt,
          },
        });
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2003') {
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
      throwPrismaError(error, {
        code: 'P2025',
        exception: NotFoundException,
        message: 'User not found',
      });
    }
  }

  public async updateEmail(
    id: string,
    ip: string,
    emailDto: EmailWithLocaleDto,
  ): Promise<AuthResponseDto> {
    const user = await this.getUserById(id, 'edit');

    if (user.isVerified) {
      throw new BadRequestException('Email is verified');
    }

    const token = this.createCryptoToken();

    try {
      const newUser = await this.prisma.$transaction(async (prisma) => {
        const updatedUser = await prisma.user.update({
          where: { id },
          data: {
            email: emailDto.email,
          },
          include: {
            role: true,
            desiredRoles: true,
          },
        });

        if (user.email !== updatedUser.email) {
          await this.createVerificationEmailRecords(
            ip,
            updatedUser,
            token,
            prisma,
          );
        }

        return UserMapper.toAuthResponse(updatedUser);
      });

      const params = new URLSearchParams({
        token: token.raw,
        email: newUser.email,
      });

      const url = `${this.configService.get(
        'BASE_FRONTEND_URL',
      )}/verify-email?${params.toString()}`;

      await this.mailService.sendVerificationMail(
        newUser.email,
        url,
        emailDto.locale,
      );

      return newUser;
    } catch (error) {
      throwPrismaError(error, [
        {
          code: 'P2025',
          exception: NotFoundException,
          message: 'User not found',
        },
        {
          code: 'P2002',
          exception: ConflictException,
          message: 'Email is already in use',
        },
      ]);
    }
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
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({
        where,
      }),
    ]);

    return {
      total,
      users: users.map((user) => UserMapper.toCardResponse(user)),
    };
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
      throwPrismaError(error, {
        code: 'P2025',
        exception: NotFoundException,
        message: 'User not found',
      });
    }
  }

  public createCryptoToken(): CryptoTokenInterface {
    const raw = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash('sha256').update(raw).digest('hex');
    const createdAt = new Date();
    return { raw, hashed, createdAt };
  }

  public async getActiveProjectsCount(id: string): Promise<CountResponseDto> {
    const countData = await this.prisma.user.findUnique({
      where: { id },
      select: { activeProjectsCount: true },
    });
    return { count: countData?.activeProjectsCount ?? 0 };
  }
}
