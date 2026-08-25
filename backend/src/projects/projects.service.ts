import {
  BadRequestException,
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
import { ProjectMapper } from '../common/mappers/project.mapper';
import { ParticipationStatus, Prisma, ProjectStatus } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ProjectRolesService } from '../project-roles/project-roles.service';
import { DiscordService } from '../discord/discord.service';
import { UsersService } from '../users/users.service';
import { ProjectCardResponseDto } from './dto/project-card.response-dto';
import { ProjectCategoryMapper } from '../common/mappers/project-category.mapper';
import imageSize from 'image-size';
import { ProjectLogoResponseDto } from './dto/project-logo.response-dto';
import { ProjectLogoMapper } from '../common/mappers/project-logo.mapper';
import { DocumentResponseDto } from '../documents/dto/document.response-dto';
import { DocumentMapper } from '../common/mappers/document.mapper';
import { DEFAULT_NAMES } from '../common/constants/default-names';
import { BoardResponseDto } from '../boards/dto/board.response-dto';
import { BoardMapper } from '../common/mappers/board.mapper';
import { throwPrismaError } from '../common/utils/throw-prisma-error';
import { MyParticipationResponseDto } from '../participations/dto/my-participation.response-dto';

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
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly projectRolesService: ProjectRolesService,
    private readonly discordService: DiscordService,
    private readonly usersService: UsersService,
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
    authId: string,
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
      }),
    };

    const projects = await this.prisma.project.findMany({
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
    });
    const total = await this.prisma.project.count({ where });

    const projectsIds = projects.map((project) => project.id);
    const myParticipations = await this.getMyActiveParticipations(
      authId,
      projectsIds,
    );

    return {
      total,
      projects: projects.map((project) =>
        ProjectMapper.toExpandedCardResponse(
          project,
          myParticipations.get(project.id) ?? null,
        ),
      ),
    };
  }

  public async createProject(
    userId: string,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    const user = await this.usersService.getUserById(userId);

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
                ...createProjectDto.rolesIds.map((roleTypeId) => ({
                  roleType: {
                    connect: { id: roleTypeId },
                  },
                })),
              ],
            },
            boards: {
              create: {
                boardName: DEFAULT_NAMES[createProjectDto.locale].board,
                columns: {
                  create: DEFAULT_NAMES[createProjectDto.locale].defaultColumns,
                },
              },
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
            owner: {
              include: {
                desiredRoles: true,
              },
            },
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

      return ProjectMapper.toFullResponse(newProject, null);
    } catch (error) {
      await this.discordService.deleteProjectChannel(
        channelId,
        adminRoleId,
        memberRoleId,
      );

      throwPrismaError(error, {
        code: 'P2003',
        exception: BadRequestException,
        message: 'Some role type IDs or category ID are invalid',
      });
    }
  }

  public async getProjectById<T extends boolean>(
    id: string,
    withDetails: T,
    authId: string,
  ): Promise<T extends true ? ProjectResponseDto : ProjectCardResponseDto>;

  public async getProjectById(
    id: string,
    withDetails: boolean,
    authId: string,
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
            orderBy: { createdAt: 'asc' },
            include: {
              roleType: true,
              users: {
                include: {
                  desiredRoles: true,
                },
              },
            },
          },
          owner: {
            include: {
              desiredRoles: true,
            },
          },
        },
      });

      const myParticipation = await this.getMyActiveParticipation(authId, id);

      return withDetails
        ? ProjectMapper.toFullResponse(project, myParticipation)
        : ProjectMapper.toExpandedCardResponse(project, myParticipation);
    } catch (error) {
      throwPrismaError(error, {
        code: 'P2025',
        exception: NotFoundException,
        message: 'Project not found',
      });
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
          owner: {
            include: {
              desiredRoles: true,
            },
          },
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

      return ProjectMapper.toFullResponse(updatedProject, null);
    } catch (error) {
      throwPrismaError(error, [
        {
          code: 'P2025',
          exception: NotFoundException,
          message: 'Project not found',
        },
        {
          code: 'P2003',
          exception: BadRequestException,
          message: 'Some role type IDs or category ID are invalid',
        },
      ]);
    }
  }

  public async closeProject(id: string): Promise<ProjectResponseDto> {
    try {
      const closedProject = await this.prisma.$transaction(async (prisma) => {
        await this.projectRolesService.clearSlots(id, prisma);

        const project = await prisma.project.update({
          where: { id },
          data: {
            status: ProjectStatus.done,
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
            owner: {
              include: {
                desiredRoles: true,
              },
            },
          },
        });

        const usersIds: string[] = [
          ...project.roles.flatMap((role) => role.users.map((user) => user.id)),
          project.ownerId,
        ];

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

        return project;
      });

      return ProjectMapper.toFullResponse(closedProject, null);
    } catch (error) {
      throwPrismaError(error, {
        code: 'P2025',
        exception: NotFoundException,
        message: 'Project, role or user in team not found',
      });
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

        const usersIds: string[] = [
          ...projectToDelete.roles.flatMap((role) =>
            role.users.map((user) => user.id),
          ),
          projectToDelete.ownerId,
        ];

        await prisma.user.updateMany({
          where: {
            id: { in: usersIds },
          },
          data: {
            activeProjectsCount: { decrement: 1 },
          },
        });

        return projectToDelete;
      });

      await this.cloudinaryService.deleteProjectFolder(id);

      await this.discordService.deleteProjectChannel(
        deletedProject.discordChannelId,
        deletedProject.discordAdminRoleId,
        deletedProject.discordMemberRoleId,
      );
    } catch (error) {
      throwPrismaError(error, {
        code: 'P2025',
        exception: NotFoundException,
        message: 'Project or user in team not found',
      });
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

  public async getDocumentsList(
    projectId: string,
  ): Promise<DocumentResponseDto[]> {
    const docs = await this.prisma.document.findMany({
      where: { projectId },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return docs.map((doc) => DocumentMapper.toResponse(doc));
  }

  public async getBoardsList(projectId: string): Promise<BoardResponseDto[]> {
    const boards = await this.prisma.board.findMany({
      where: { projectId },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        columns: {
          include: {
            _count: {
              select: {
                tasks: true,
              },
            },
          },
        },
      },
    });

    return boards.map(BoardMapper.toResponse);
  }

  public async getMyActiveParticipation(
    authId: string,
    projectId: string,
  ): Promise<MyParticipationResponseDto | null> {
    const request = await this.prisma.participationRequest.findFirst({
      where: {
        userId: authId,
        status: {
          in: [ParticipationStatus.pending, ParticipationStatus.reserved],
        },
        projectRole: {
          projectId,
        },
      },
      select: {
        id: true,
        projectRole: {
          select: {
            id: true,
            slots: true,
            roleType: {
              select: {
                id: true,
                roleName: true,
              },
            },
          },
        },
      },
    });

    if (request) {
      return { type: 'request', ...request };
    }

    const invite = await this.prisma.participationInvite.findFirst({
      where: {
        userId: authId,
        status: {
          in: [ParticipationStatus.pending, ParticipationStatus.reserved],
        },
        projectRole: {
          projectId,
        },
      },
      select: {
        id: true,
        projectRole: {
          select: {
            id: true,
            slots: true,
            roleType: {
              select: {
                id: true,
                roleName: true,
              },
            },
          },
        },
      },
    });

    if (invite) {
      return { type: 'invite', ...invite };
    }

    return null;
  }

  public async getMyActiveParticipations(
    authId: string,
    projectIds: string[],
  ): Promise<Map<string, MyParticipationResponseDto>> {
    const requests = await this.prisma.participationRequest.findMany({
      where: {
        userId: authId,
        status: {
          in: [ParticipationStatus.pending, ParticipationStatus.reserved],
        },
        projectRole: {
          projectId: {
            in: projectIds,
          },
        },
      },
      select: {
        id: true,
        projectRole: {
          select: {
            projectId: true,
            id: true,
            slots: true,
            roleType: {
              select: {
                id: true,
                roleName: true,
              },
            },
          },
        },
      },
    });

    const invites = await this.prisma.participationInvite.findMany({
      where: {
        userId: authId,
        status: {
          in: [ParticipationStatus.pending, ParticipationStatus.reserved],
        },
        projectRole: {
          projectId: {
            in: projectIds,
          },
        },
      },
      select: {
        id: true,
        projectRole: {
          select: {
            projectId: true,
            id: true,
            slots: true,
            roleType: {
              select: {
                id: true,
                roleName: true,
              },
            },
          },
        },
      },
    });

    const participations = new Map<string, MyParticipationResponseDto>();

    for (const request of requests) {
      participations.set(request.projectRole.projectId, {
        ...request,
        type: 'request',
      });
    }

    for (const invite of invites) {
      participations.set(invite.projectRole.projectId, {
        ...invite,
        type: 'invite',
      });
    }

    return participations;
  }
}
