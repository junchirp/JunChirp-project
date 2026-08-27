import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ParticipationStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthWithPasswordResponseDto } from './dto/auth-with-password.response-dto';
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
import { UserParticipationInMyProjectsResponseDto } from './dto/user-participation-in-my-projects.response-dto';
import { UserCardResponseDto } from './dto/user-card.response-dto';

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
  ): Promise<AuthResponseDto> {
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
            desiredRoles: true,
          },
        });

        return UserMapper.toAuthResponse(user, false);
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
  ): Promise<AuthWithPasswordResponseDto | AuthResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        desiredRoles: true,
      },
    });

    return user ? UserMapper.toAuthResponse(user, withPassword) : null;
  }

  public async getUserById(id: string): Promise<AuthResponseDto>;

  public async getUserById(
    id: string,
    authId: string,
  ): Promise<UserResponseDto>;

  public async getUserById(
    id: string,
    authId?: string,
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

      if (!authId) {
        return UserMapper.toAuthResponse(user, false);
      }

      const projectParticipationSummary =
        await this.getUserParticipationSummaryInOwnerProjects(id, authId);

      return UserMapper.toFullResponse(user, projectParticipationSummary);
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
  ): Promise<{ user: AuthResponseDto; authType: 'registration' | 'login' }> {
    const user = await this.getUserByEmail(createGoogleUserDto.email, false);
    let updatedUser: AuthResponseDto;
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
          desiredRoles: true,
        },
      });
      updatedUser = UserMapper.toAuthResponse(userFromDB, false);
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
      updatedUser = UserMapper.toAuthResponse(userFromDB, false);
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

      return UserMapper.toAuthResponse(updatedUser, false);
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
    const user = await this.getUserById(id);

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

        return UserMapper.toAuthResponse(updatedUser, false);
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
    authId: string,
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

    const usersIds = users.map((user) => user.id);
    const projectsParticipationsSummary =
      await this.getUsersParticipationsSummaryInOwnerProjects(usersIds, authId);

    const usersWithSummary: UserCardResponseDto[] = [];
    for (const user of users) {
      usersWithSummary.push(
        UserMapper.toCardResponse(
          user,
          projectsParticipationsSummary.get(user.id) ?? {
            participationsCount: 0,
            activeRequestsCount: 0,
            activeInvitesCount: 0,
          },
        ),
      );
    }

    return {
      total,
      users: usersWithSummary,
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

  private async getUserParticipationSummaryInOwnerProjects(
    userId: string,
    ownerId: string,
  ): Promise<UserParticipationInMyProjectsResponseDto> {
    const projectsCount = await this.prisma.project.count({
      where: {
        ownerId,
        roles: {
          some: {
            users: {
              some: {
                id: userId,
              },
            },
          },
        },
      },
    });

    const invitesCount = await this.prisma.participationInvite.count({
      where: {
        userId,
        status: {
          in: [ParticipationStatus.pending, ParticipationStatus.reserved],
        },
        projectRole: {
          project: {
            ownerId,
          },
        },
      },
    });

    const requestsCount = await this.prisma.participationRequest.count({
      where: {
        userId,
        status: {
          in: [ParticipationStatus.pending, ParticipationStatus.reserved],
        },
        projectRole: {
          project: {
            ownerId,
          },
        },
      },
    });

    return {
      participationsCount: projectsCount,
      activeRequestsCount: requestsCount,
      activeInvitesCount: invitesCount,
    };
  }

  private async getUsersParticipationsSummaryInOwnerProjects(
    userIds: string[],
    ownerId: string,
  ): Promise<Map<string, UserParticipationInMyProjectsResponseDto>> {
    const participations = await this.prisma.project.findMany({
      where: {
        ownerId,
        roles: {
          some: {
            users: {
              some: {
                id: {
                  in: userIds,
                },
              },
            },
          },
        },
      },
      select: {
        roles: {
          select: {
            users: {
              where: {
                id: {
                  in: userIds,
                },
              },
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const requests = await this.prisma.participationRequest.findMany({
      where: {
        userId: {
          in: userIds,
        },
        status: {
          in: [ParticipationStatus.pending, ParticipationStatus.reserved],
        },
        projectRole: {
          project: {
            ownerId,
          },
        },
      },
      select: {
        userId: true,
      },
    });

    const invites = await this.prisma.participationInvite.findMany({
      where: {
        userId: {
          in: userIds,
        },
        status: {
          in: [ParticipationStatus.pending, ParticipationStatus.reserved],
        },
        projectRole: {
          project: {
            ownerId,
          },
        },
      },
      select: {
        userId: true,
      },
    });

    const summaries = new Map<
      string,
      UserParticipationInMyProjectsResponseDto
    >();

    for (const userId of userIds) {
      summaries.set(userId, {
        participationsCount: 0,
        activeRequestsCount: 0,
        activeInvitesCount: 0,
      });
    }

    for (const project of participations) {
      for (const role of project.roles) {
        for (const user of role.users) {
          const summary = summaries.get(user.id);

          if (summary) {
            summary.participationsCount++;
          }
        }
      }
    }

    for (const request of requests) {
      const summary = summaries.get(request.userId);

      if (summary) {
        summary.activeRequestsCount++;
      }
    }

    for (const invite of invites) {
      const summary = summaries.get(invite.userId);

      if (summary) {
        summary.activeInvitesCount++;
      }
    }

    return summaries;
  }
}
