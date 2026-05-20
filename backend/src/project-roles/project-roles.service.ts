import {
  BadRequestException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ProjectRoleType } from '@prisma/client';
import { ProjectRoleTypeResponseDto } from './dto/project-role-type.response-dto';
import { isPrismaError } from 'src/shared/utils/is-prisma-error';
import { ProjectRoleWithUserResponseDto } from './dto/project-role-with-user.response-dto';
import { DiscordService } from '../discord/discord.service';
import { ProjectRoleMapper } from '../shared/mappers/project-role.mapper';

@Injectable()
export class ProjectRolesService {
  public constructor(
    private prisma: PrismaService,
    private discordService: DiscordService,
  ) {}

  public async getProjectRoleTypes(): Promise<ProjectRoleTypeResponseDto[]> {
    return this.prisma.projectRoleType.findMany({
      where: {
        roleName: {
          not: 'Project owner',
        },
      },
    });
  }

  public async findOrCreateRole(roleName: string): Promise<ProjectRoleType> {
    return this.prisma.projectRoleType.upsert({
      where: { roleName },
      update: {},
      create: { roleName },
    });
  }

  // public async createProjectRole(
  //   createProjectRoleDto: CreateProjectRoleDto,
  // ): Promise<ProjectRoleResponseDto> {
  //   try {
  //     await this.prisma.project.findUniqueOrThrow({
  //       where: { id: createProjectRoleDto.projectId },
  //     });
  //
  //     await this.prisma.projectRoleType.findUniqueOrThrow({
  //       where: { id: createProjectRoleDto.roleTypeId },
  //     });
  //
  //     const role = await this.prisma.projectRole.create({
  //       data: createProjectRoleDto,
  //       include: { roleType: true },
  //     });
  //
  //     return ProjectRoleMapper.toBaseResponse(role);
  //   } catch (error) {
  //     if (isPrismaError(error) && error.code === 'P2025') {
  //       throw new NotFoundException('Project or role type not found');
  //     }
  //     throw error;
  //   }
  // }
  //
  // public async deleteProjectRole(id: string): Promise<void> {
  //   const role = await this.prisma.projectRole.findUnique({
  //     where: { id },
  //     include: { roleType: true },
  //   });
  //
  //   if (role?.roleType.roleName.toLowerCase() === 'project owner') {
  //     throw new MethodNotAllowedException(
  //       'You cannot delete the project owner role',
  //     );
  //   }
  //
  //   await this.prisma.$transaction(async (prisma) => {
  //     try {
  //       const projectRole = await prisma.projectRole.delete({
  //         where: { id },
  //       });
  //       if (projectRole.userId) {
  //         await prisma.project.update({
  //           where: { id: projectRole.projectId },
  //           data: {
  //             participantsCount: {
  //               decrement: 1,
  //             },
  //           },
  //         });
  //       }
  //     } catch (error) {
  //       if (isPrismaError(error) && error.code === 'P2025') {
  //         throw new NotFoundException('Project role not found');
  //       }
  //       throw error;
  //     }
  //   });
  // }

  public async clearSlots(
    projectId: string,
    px: Prisma.TransactionClient,
  ): Promise<void> {
    try {
      const roles = await px.projectRole.findMany({
        where: { projectId },
        select: {
          id: true,
          _count: {
            select: { users: true },
          },
        },
      });

      const rolesToDelete: string[] = [];
      const rolesToUpdate: { id: string; slots: number }[] = [];

      for (const role of roles) {
        const usersCount = role._count.users;

        if (usersCount === 0) {
          rolesToDelete.push(role.id);
        } else {
          rolesToUpdate.push({
            id: role.id,
            slots: usersCount,
          });
        }
      }

      if (rolesToDelete.length) {
        await px.projectRole.deleteMany({
          where: { id: { in: rolesToDelete } },
        });
      }

      for (const role of rolesToUpdate) {
        await px.projectRole.update({
          where: { id: role.id },
          data: { slots: role.slots },
        });
      }
    } catch (error) {
      if (isPrismaError(error)) {
        switch (error.code) {
          case 'P2025':
            throw new NotFoundException(
              'Project roles not found or already removed',
            );
          case 'P2003':
            throw new BadRequestException(
              'Cannot update or delete roles due to related constraints',
            );
        }
      }
      throw error;
    }
  }
}
