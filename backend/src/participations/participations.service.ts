import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInviteDto } from './dto/create-invite.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserParticipationResponseDto } from './dto/user-participation.response-dto';
import { UserParticipationMapper } from '../shared/mappers/user-participation.mapper';
import { ProjectParticipationResponseDto } from './dto/project-participation.response-dto';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { ProjectParticipationMapper } from '../shared/mappers/project-participation.mapper';
import { CreateRequestDto } from './dto/create-request.dto';
import { DiscordService } from '../discord/discord.service';
import { UserCardResponseDto } from '../users/dto/user-card.response-dto';
import { UserMapper } from '../shared/mappers/user.mapper';
import { UsersService } from '../users/users.service';
import { isPrismaError } from '../shared/utils/is-prisma-error';

@Injectable()
export class ParticipationsService {
  public constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private configService: ConfigService,
    private discordService: DiscordService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  public async createInvite(
    createInviteDto: CreateInviteDto,
  ): Promise<ProjectParticipationResponseDto> {
    const user = await this.usersService.getUserById(
      createInviteDto.userId,
      'edit',
    );

    if (user.activeProjectsCount === 2) {
      throw new BadRequestException(
        'User cannot have more than 2 active projects',
      );
    }

    try {
      const invite = await this.prisma.$transaction(async (prisma) => {
        const currentRole = await prisma.projectRole.findUnique({
          where: {
            id: createInviteDto.projectRoleId,
          },
          include: {
            users: true,
          },
        });

        if (
          currentRole &&
          currentRole.projectId !== createInviteDto.projectId
        ) {
          throw new BadRequestException('Invalid project/role combination');
        }

        if (currentRole && currentRole.users.length >= currentRole.slots) {
          throw new BadRequestException('The role has no empty slots');
        }

        const isParticipant = await prisma.project.findFirst({
          where: {
            id: createInviteDto.projectId,
            OR: [
              {
                ownerId: createInviteDto.userId,
              },
              {
                roles: {
                  some: {
                    users: {
                      some: {
                        id: createInviteDto.userId,
                      },
                    },
                  },
                },
              },
            ],
          },
        });

        if (isParticipant) {
          throw new ConflictException('User is already in the project team');
        }

        const existingRequest = await prisma.participationRequest.findFirst({
          where: {
            userId: createInviteDto.userId,
            projectRole: { projectId: createInviteDto.projectId },
          },
        });

        if (existingRequest) {
          throw new ConflictException(
            'User has already requested participation in this project',
          );
        }

        const existingInvite = await prisma.participationInvite.findFirst({
          where: {
            userId: createInviteDto.userId,
            projectRole: { projectId: createInviteDto.projectId },
          },
        });

        if (existingInvite) {
          throw new ConflictException(
            'User has already been invited to this project',
          );
        }

        return prisma.participationInvite.create({
          data: {
            userId: createInviteDto.userId,
            projectRoleId: createInviteDto.projectRoleId,
            projectId: createInviteDto.projectId,
          },
          include: {
            projectRole: {
              include: {
                roleType: true,
                project: {
                  include: {
                    logo: true,
                    category: {
                      include: {
                        translations: true,
                      },
                    },
                    roles: {
                      include: {
                        roleType: true,
                        users: {
                          include: {
                            desiredRoles: true,
                          },
                        },
                      },
                    },
                    owner: true,
                  },
                },
              },
            },
          },
        });
      });

      await this.mailService.sendParticipationInvite(
        `${this.configService.get<string>(
          'BASE_FRONTEND_URL',
        )}/projects/${invite.projectId}`,
        invite,
        user,
        createInviteDto.locale,
      );

      return ProjectParticipationMapper.toResponse(invite);
    } catch (error) {
      if (isPrismaError(error)) {
        switch (error.code) {
          case 'P2003':
            throw new NotFoundException('User or project role not found');
          case 'P2002':
            throw new ConflictException(
              'User has already been invited to this project',
            );
          default:
            throw error;
        }
      }
      throw error;
    }
  }

  public async createRequest(
    createRequestDto: CreateRequestDto,
    userId: string,
  ): Promise<ProjectParticipationResponseDto> {
    const user = await this.usersService.getUserById(userId, 'edit');

    if (user.activeProjectsCount === 2) {
      throw new BadRequestException(
        'User cannot have more than 2 active projects',
      );
    }

    try {
      const request = await this.prisma.$transaction(async (prisma) => {
        const currentRole = await prisma.projectRole.findUnique({
          where: {
            id: createRequestDto.projectRoleId,
          },
          include: {
            users: true,
          },
        });

        if (
          currentRole &&
          currentRole.projectId !== createRequestDto.projectId
        ) {
          throw new BadRequestException('Invalid project/role combination');
        }

        if (currentRole && currentRole.users.length >= currentRole.slots) {
          throw new BadRequestException('The role has no empty slots');
        }

        const isParticipant = await prisma.project.findFirst({
          where: {
            id: createRequestDto.projectId,
            OR: [
              {
                ownerId: userId,
              },
              {
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
            ],
          },
        });

        if (isParticipant) {
          throw new ConflictException('You are already in the project team');
        }

        const existingInvite = await prisma.participationInvite.findFirst({
          where: {
            userId,
            projectRole: { projectId: createRequestDto.projectId },
          },
        });

        if (existingInvite) {
          throw new ConflictException(
            'You have already been invited to this project',
          );
        }

        const existingRequest = await prisma.participationRequest.findFirst({
          where: {
            userId,
            projectRole: { projectId: createRequestDto.projectId },
          },
        });

        if (existingRequest) {
          throw new ConflictException(
            'You have already sent a request to this project',
          );
        }

        return prisma.participationRequest.create({
          data: {
            userId,
            projectRoleId: createRequestDto.projectRoleId,
            projectId: createRequestDto.projectId,
          },
          include: {
            projectRole: {
              include: {
                roleType: true,
                project: {
                  include: {
                    logo: true,
                    category: {
                      include: {
                        translations: true,
                      },
                    },
                    roles: {
                      include: {
                        roleType: true,
                        users: {
                          include: {
                            desiredRoles: true,
                          },
                        },
                      },
                    },
                    owner: true,
                  },
                },
              },
            },
          },
        });
      });

      await this.mailService.sendParticipationRequest(
        `${this.configService.get<string>(
          'BASE_FRONTEND_URL',
        )}/users/${request.userId}`,
        request,
        createRequestDto.locale,
      );

      return ProjectParticipationMapper.toResponse(request);
    } catch (error) {
      if (isPrismaError(error)) {
        switch (error.code) {
          case 'P2003':
            throw new NotFoundException('Project role not found');
          case 'P2002':
            throw new ConflictException(
              'You have already sent a request to this project',
            );
          default:
            throw error;
        }
      }
      throw error;
    }
  }

  public async acceptInvite(
    id: string,
    userId: string,
  ): Promise<UserCardResponseDto> {
    try {
      const { user, discordId, discordMemberRoleId } =
        await this.prisma.$transaction(async (prisma) => {
          const invite = await prisma.participationInvite.findUniqueOrThrow({
            where: { id, userId },
            include: {
              projectRole: {
                include: {
                  project: true,
                  users: true,
                },
              },
              user: true,
            },
          });
          if (invite.user.activeProjectsCount >= 2) {
            throw new BadRequestException(
              'User cannot have more than 2 active projects',
            );
          }

          if (invite.projectRole.users.length === invite.projectRole.slots) {
            throw new ConflictException('The role has no empty slots');
          }

          await prisma.projectRole.update({
            where: { id: invite.projectRoleId },
            data: {
              users: {
                connect: { id: invite.userId },
              },
            },
          });

          await prisma.project.update({
            where: {
              id: invite.projectRole.projectId,
            },
            data: {
              participantsCount: {
                increment: 1,
              },
            },
          });

          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
              activeProjectsCount: {
                increment: 1,
              },
            },
            include: {
              desiredRoles: true,
            },
          });

          await prisma.participationInvite.delete({
            where: { id },
          });

          return {
            user: updatedUser,
            discordId: invite.user.discordId,
            discordMemberRoleId: invite.projectRole.project.discordMemberRoleId,
          };
        });

      if (discordId) {
        await this.discordService.addRoleToUser(discordId, discordMemberRoleId);
      }

      return UserMapper.toCardResponse(user);
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2025') {
        throw new NotFoundException('Invite not found');
      }
      throw error;
    }
  }

  public async declineInvite(id: string, userId: string): Promise<void> {
    try {
      await this.prisma.participationInvite.delete({
        where: { id, userId },
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2025') {
        throw new NotFoundException('Invite not found');
      }
      throw error;
    }
  }

  public async acceptRequest(id: string): Promise<void> {
    try {
      const { discordId, discordMemberRoleId } = await this.prisma.$transaction(
        async (prisma) => {
          const request = await prisma.participationRequest.findUniqueOrThrow({
            where: { id },
            include: {
              projectRole: {
                include: {
                  project: true,
                  users: true,
                },
              },
              user: true,
            },
          });

          if (request.projectRole.users.length === request.projectRole.slots) {
            throw new ConflictException('The role has no empty slots');
          }

          if (request.user.activeProjectsCount >= 2) {
            throw new BadRequestException(
              'User cannot have more than 2 active projects',
            );
          }

          await prisma.projectRole.update({
            where: { id: request.projectRoleId },
            data: {
              users: {
                connect: { id: request.userId },
              },
            },
          });

          await prisma.project.update({
            where: { id: request.projectRole.projectId },
            data: {
              participantsCount: {
                increment: 1,
              },
            },
          });

          await prisma.user.update({
            where: { id: request.userId },
            data: {
              activeProjectsCount: {
                increment: 1,
              },
            },
          });

          await prisma.participationRequest.delete({
            where: { id },
          });

          return {
            discordId: request.user.discordId,
            discordMemberRoleId:
              request.projectRole.project.discordMemberRoleId,
          };
        },
      );

      if (discordId) {
        await this.discordService.addRoleToUser(discordId, discordMemberRoleId);
      }
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2025') {
        throw new NotFoundException('Request not found');
      }

      throw error;
    }
  }

  public async declineRequest(id: string): Promise<void> {
    try {
      await this.prisma.participationRequest.delete({
        where: { id },
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2025') {
        throw new NotFoundException('Request not found');
      }
      throw error;
    }
  }

  public async cancelRequest(id: string, userId: string): Promise<void> {
    try {
      await this.prisma.participationRequest.delete({
        where: { id, userId },
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2025') {
        throw new NotFoundException('Request not found');
      }
      throw error;
    }
  }

  public async cancelInvite(id: string): Promise<void> {
    try {
      await this.prisma.participationInvite.delete({
        where: { id },
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2025') {
        throw new NotFoundException('Invite not found');
      }
      throw error;
    }
  }

  public async getInvitesWithProjects(
    userId: string,
    ownerId?: string,
  ): Promise<ProjectParticipationResponseDto[]> {
    const invites = await this.prisma.participationInvite.findMany({
      where: {
        userId,
        ...(ownerId && {
          projectRole: {
            project: {
              ownerId,
            },
          },
        }),
      },
      include: {
        projectRole: {
          include: {
            roleType: true,
            project: {
              include: {
                logo: true,
                category: {
                  include: {
                    translations: true,
                  },
                },
                roles: {
                  include: {
                    roleType: true,
                    users: {
                      include: {
                        desiredRoles: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return invites.map((invite) =>
      ProjectParticipationMapper.toResponse(invite),
    );
  }

  public async getRequestsWithProjects(
    userId: string,
    ownerId?: string,
  ): Promise<ProjectParticipationResponseDto[]> {
    const requests = await this.prisma.participationRequest.findMany({
      where: {
        userId,
        ...(ownerId && {
          projectRole: {
            project: {
              ownerId,
            },
          },
        }),
      },
      include: {
        projectRole: {
          include: {
            roleType: true,
            project: {
              include: {
                logo: true,
                category: {
                  include: {
                    translations: true,
                  },
                },
                roles: {
                  include: {
                    roleType: true,
                    users: {
                      include: {
                        desiredRoles: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return requests.map((request) =>
      ProjectParticipationMapper.toResponse(request),
    );
  }

  public async getInvitesWithUsers(
    projectId: string,
  ): Promise<UserParticipationResponseDto[]> {
    const invites = await this.prisma.participationInvite.findMany({
      where: { projectRole: { projectId } },
      include: {
        user: {
          include: {
            desiredRoles: true,
          },
        },
        projectRole: {
          include: {
            roleType: true,
          },
        },
      },
    });

    return invites.map((invite) => UserParticipationMapper.toResponse(invite));
  }

  public async getRequestsWithUsers(
    projectId: string,
  ): Promise<UserParticipationResponseDto[]> {
    const requests = await this.prisma.participationRequest.findMany({
      where: { projectRole: { projectId } },
      include: {
        user: {
          include: {
            desiredRoles: true,
          },
        },
        projectRole: {
          include: {
            roleType: true,
          },
        },
      },
    });

    return requests.map((request) =>
      UserParticipationMapper.toResponse(request),
    );
  }
}
