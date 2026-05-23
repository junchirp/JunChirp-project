import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectCategoryResponseDto } from './dto/project-category.response-dto';
import { ProjectResponseDto } from './dto/project.response-dto';
import { ProjectsListResponseDto } from './dto/projects-list.response-dto';
import { ProjectMapper } from '../shared/mappers/project.mapper';
import { Prisma, ProjectStatus } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ProjectRolesService } from '../project-roles/project-roles.service';
import { ParticipationsService } from '../participations/participations.service';
import { UserParticipationResponseDto } from '../participations/dto/user-participation.response-dto';
import { DiscordService } from '../discord/discord.service';
import { UsersService } from '../users/users.service';
import { ProjectCardResponseDto } from './dto/project-card.response-dto';
import { ProjectCategoryMapper } from '../shared/mappers/project-category.mapper';
import { isPrismaError } from '../shared/utils/is-prisma-error';
import imageSize from 'image-size';
import { ProjectLogoResponseDto } from './dto/project-logo.response-dto';
import { ProjectLogoMapper } from '../shared/mappers/project-logo.mapper';
import { DocumentResponseDto } from '../documents/dto/document.response-dto';
import { DocumentMapper } from '../shared/mappers/document.mapper';

interface GetProjectsOptionsInterface {
  userId: string;
  status: ProjectStatus;
  categoryId: string;
  minParticipants: number;
  maxParticipants: number;
  page: number;
  limit: number;
}

@Injectable()
export class ProjectsService {
  public constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
    private projectRolesService: ProjectRolesService,
    private participationsService: ParticipationsService,
    private discordService: DiscordService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  public async getCategories(): Promise<ProjectCategoryResponseDto[]> {
    const categories = await this.prisma.projectCategory.findMany({
      include: {
        translations: true,
      },
    });

    return categories.map((category) =>
      ProjectCategoryMapper.toResponse(category),
    );
  }

  public async getProjects(
    options: Partial<GetProjectsOptionsInterface>,
  ): Promise<ProjectsListResponseDto> {
    const {
      userId,
      status,
      categoryId,
      minParticipants,
      maxParticipants,
      page = 1,
      limit = 20,
    } = options;

    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {
      ...(status && { status }),
      ...(categoryId && { categoryId }),
      ...(minParticipants || maxParticipants
        ? {
            participantsCount: {
              ...(minParticipants && { gte: minParticipants }),
              ...(maxParticipants && { lte: maxParticipants }),
            },
          }
        : {}),
      ...(userId && {
        roles: {
          some: {
            users: {
              some: {
                id: userId,
              },
            },
          },
        },
      }),
    };

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
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
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      total,
      projects: projects.map((project) =>
        ProjectMapper.toCardResponse(project),
      ),
    };
  }

  public async createProject(
    userId: string,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    const user = await this.usersService.getUserById(userId, 'edit');

    if (user.activeProjectsCount >= 2) {
      throw new BadRequestException(
        'You have reached the limit of active projects',
      );
    }

    const { channelId, adminRoleId, memberRoleId } =
      await this.discordService.createProjectChannel(
        createProjectDto.projectName,
      );

    try {
      const newProject = await this.prisma.$transaction(async (prisma) => {
        const ownerRoleType =
          await this.projectRolesService.findOrCreateRole('Project owner');

        const project = await prisma.project.create({
          data: {
            ownerId: userId,
            projectName: createProjectDto.projectName,
            description: createProjectDto.description,
            categoryId: createProjectDto.categoryId,
            discordChannelId: channelId,
            discordAdminRoleId: adminRoleId,
            discordMemberRoleId: memberRoleId,
            roles: {
              create: [
                {
                  roleType: {
                    connect: { id: ownerRoleType.id },
                  },
                  users: {
                    connect: { id: userId },
                  },
                },
                ...createProjectDto.rolesIds.map((roleTypeId) => ({
                  roleType: {
                    connect: { id: roleTypeId },
                  },
                })),
              ],
            },
          },
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
            documents: true,
            owner: true,
            boards: true,
          },
        });

        await prisma.user.update({
          where: { id: userId },
          data: {
            activeProjectsCount: {
              increment: 1,
            },
          },
        });

        return project;
      });

      if (newProject.owner.discordId) {
        await this.discordService.addRoleToUser(
          newProject.owner.discordId,
          adminRoleId,
        );
      }

      return ProjectMapper.toFullResponse(newProject);
    } catch (error) {
      await this.discordService.deleteProjectChannel(
        channelId,
        adminRoleId,
        memberRoleId,
      );

      if (isPrismaError(error) && error.code === 'P2003') {
        throw new BadRequestException(
          'Some role type IDs or category ID are invalid',
        );
      }

      throw error;
    }
  }

  public async getProjectById<T extends boolean>(
    id: string,
    withDetails: T,
  ): Promise<T extends true ? ProjectResponseDto : ProjectCardResponseDto>;

  public async getProjectById(
    id: string,
    withDetails: boolean,
  ): Promise<ProjectResponseDto | ProjectCardResponseDto> {
    try {
      const project = await this.prisma.project.findUniqueOrThrow({
        where: { id },
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
          documents: true,
          owner: true,
          boards: true,
        },
      });

      return withDetails
        ? ProjectMapper.toFullResponse(project)
        : ProjectMapper.toCardResponse(project);
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2025') {
        throw new NotFoundException('Project not found');
      }
      throw error;
    }
  }

  public async updateProject(
    id: string,
    dto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    try {
      const currentProject = await this.prisma.project.findUniqueOrThrow({
        where: { id },
        select: {
          projectName: true,
          discordChannelId: true,
        },
      });

      const updatedProject = await this.prisma.project.update({
        where: { id },
        data: {
          projectName: dto.projectName,
          description: dto.description,
          categoryId: dto.categoryId,
          roles: {
            create: dto.rolesIds.map((roleTypeId) => ({
              roleType: {
                connect: { id: roleTypeId },
              },
            })),
          },
        },
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
          documents: true,
          owner: true,
          boards: true,
        },
      });

      if (
        currentProject.projectName !== dto.projectName &&
        currentProject.discordChannelId
      ) {
        await this.discordService.renameProjectChannel(
          updatedProject.discordChannelId,
          updatedProject.projectName,
        );
      }

      return ProjectMapper.toFullResponse(updatedProject);
    } catch (error) {
      switch (isPrismaError(error) && error.code) {
        case 'P2003':
          throw new BadRequestException(
            'Some role type IDs or category ID are invalid',
          );
        case 'P2025':
          throw new NotFoundException('Project not found');
        default:
          throw error;
      }
    }
  }

  public async closeProject(id: string): Promise<ProjectResponseDto> {
    try {
      const closedProject = await this.prisma.$transaction(async (prisma) => {
        await this.projectRolesService.clearSlots(id, prisma);

        const project = await prisma.project.update({
          where: { id },
          data: {
            status: 'done',
            finishedAt: new Date(),
          },
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
            documents: true,
            owner: true,
            boards: true,
          },
        });

        const usersIds: string[] = project.roles.flatMap((role) =>
          role.users.map((user) => user.id),
        );

        if (usersIds.length) {
          await prisma.user.updateMany({
            where: {
              id: { in: usersIds },
            },
            data: {
              activeProjectsCount: {
                decrement: 1,
              },
              doneProjectsCount: {
                increment: 1,
              },
            },
          });
        }

        return project;
      });

      return ProjectMapper.toFullResponse(closedProject);
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2025') {
        throw new NotFoundException('Project, role or user in team not found');
      }

      throw error;
    }
  }

  public async deleteProject(id: string): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project or user in team not found');
    }

    if (project.status === ProjectStatus.done) {
      throw new MethodNotAllowedException('Cannot delete a completed project');
    }

    try {
      const deletedProject = await this.prisma.$transaction(async (prisma) => {
        const projectToDelete = await prisma.project.delete({
          where: { id },
          include: {
            roles: {
              include: {
                users: true,
              },
            },
          },
        });

        const usersIds: string[] = projectToDelete.roles.flatMap((role) =>
          role.users.map((user) => user.id),
        );

        if (usersIds.length) {
          await prisma.user.updateMany({
            where: {
              id: { in: usersIds },
            },
            data: {
              activeProjectsCount: { decrement: 1 },
            },
          });
        }

        return projectToDelete;
      });

      await this.cloudinaryService.deleteProjectFolder(id);

      await this.discordService.deleteProjectChannel(
        deletedProject.discordChannelId,
        deletedProject.discordAdminRoleId,
        deletedProject.discordMemberRoleId,
      );
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2025') {
        throw new NotFoundException('Project or user in team not found');
      }
      throw error;
    }
  }

  public async updateProjectLogo(
    id: string,
    file: Express.Multer.File,
  ): Promise<ProjectLogoResponseDto> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const dimensions = imageSize(file.buffer);

    if (!dimensions?.width || !dimensions?.height) {
      throw new BadRequestException('Invalid image file');
    }

    const { width, height } = dimensions;
    const logoUrl = await this.cloudinaryService.uploadProjectLogo(file, id);

    const logo = await this.prisma.projectLogo.upsert({
      where: {
        projectId: id,
      },
      update: {
        url: logoUrl,
        width,
        height,
      },
      create: {
        projectId: id,
        url: logoUrl,
        width,
        height,
      },
    });

    return ProjectLogoMapper.toResponse(logo);
  }

  public async deleteProjectLogo(id: string): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const projectLogo = await this.prisma.projectLogo.findUnique({
      where: { projectId: id },
    });

    if (projectLogo) {
      await this.cloudinaryService.deleteProjectLogo(id);

      await this.prisma.projectLogo.delete({
        where: { projectId: id },
      });
    }
  }

  public async getInvites(
    projectId: string,
  ): Promise<UserParticipationResponseDto[]> {
    return this.participationsService.getInvitesWithUsers(projectId);
  }

  public async getRequests(
    projectId: string,
  ): Promise<UserParticipationResponseDto[]> {
    return this.participationsService.getRequestsWithUsers(projectId);
  }

  public async handleUserRemovalFromProject(
    projectId: string,
    userId: string,
    context: 'leave' | 'remove',
  ): Promise<void> {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const role = await prisma.projectRole.findFirst({
          where: {
            projectId: projectId,
            users: {
              some: {
                id: userId,
              },
            },
          },
          include: {
            users: true,
            roleType: true,
            project: true,
          },
        });

        if (!role) {
          throw new NotFoundException('User is not in the team');
        }

        if (role.project.ownerId === userId) {
          if (context === 'remove') {
            throw new MethodNotAllowedException(
              'You cannot delete the project owner',
            );
          } else {
            throw new MethodNotAllowedException('You cannot leave the project');
          }
        }

        const user = await prisma.user.update({
          where: { id: userId },
          data: {
            projectRoles: {
              disconnect: { id: role.id },
            },
            activeProjectsCount: {
              decrement: 1,
            },
          },
        });

        await prisma.project.update({
          where: { id: role.projectId },
          data: {
            participantsCount: {
              decrement: 1,
            },
          },
        });

        return {
          discordId: user.discordId,
          discordRoleId: role.project.discordMemberRoleId,
        };
      });

      if (result.discordId && result.discordRoleId) {
        await this.discordService.removeRoleFromUser(
          result.discordId,
          result.discordRoleId,
        );
      }
    } catch (error) {
      if (isPrismaError(error)) {
        switch (error.code) {
          case 'P2025':
            throw new NotFoundException('User not found');
          case 'P2003':
            throw new BadRequestException(
              'User is no longer part of this project',
            );
        }
      }
      throw error;
    }
  }

  public async getDocumentsList(
    projectId: string,
  ): Promise<DocumentResponseDto[]> {
    const docs = await this.prisma.document.findMany({
      where: { projectId },
    });

    return docs.map((doc) => DocumentMapper.toResponse(doc));
  }
}
