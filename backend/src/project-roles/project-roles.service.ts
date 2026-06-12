import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ProjectRoleType } from '@prisma/client';
import { ProjectRoleTypeResponseDto } from './dto/project-role-type.response-dto';
import { isPrismaError } from 'src/shared/utils/is-prisma-error';
import { ProjectRoleMapper } from '../shared/mappers/project-role.mapper';
import { CreateProjectRoleDto } from './dto/create-project-role.dto';
import { ProjectRoleResponseDto } from './dto/project-role.response-dto';

@Injectable()
export class ProjectRolesService {
  public constructor(private prisma: PrismaService) {}

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

  public async createProjectRole(
    createProjectRoleDto: CreateProjectRoleDto,
  ): Promise<ProjectRoleResponseDto> {
    try {
      const role = await this.prisma.projectRole.create({
        data: createProjectRoleDto,
        include: {
          roleType: true,
        },
      });

      return ProjectRoleMapper.toBaseResponse(role);
    } catch (error) {
      if (isPrismaError(error)) {
        switch (error.code) {
          case 'P2002':
            throw new ConflictException(
              'This role already exists in the project',
            );
          case 'P2003':
            throw new NotFoundException('Project or role type not found');
        }
      }
      throw error;
    }
  }

  public async addProjectRoleSlot(id: string): Promise<ProjectRoleResponseDto> {
    try {
      const role = await this.prisma.projectRole.update({
        where: { id },
        data: {
          slots: {
            increment: 1,
          },
        },
        include: {
          roleType: true,
        },
      });

      return ProjectRoleMapper.toBaseResponse(role);
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2025') {
        throw new NotFoundException('Project role not found');
      }
      throw error;
    }
  }

  public async deleteProjectRoleSlot(id: string): Promise<void> {
    try {
      await this.prisma.$transaction(async (prisma) => {
        const role = await prisma.projectRole.findUniqueOrThrow({
          where: { id },
          include: {
            roleType: true,
            _count: {
              select: {
                users: true,
              },
            },
          },
        });

        const occupiedSlots = role._count.users;
        const freeSlots = role.slots - occupiedSlots;

        if (freeSlots <= 0) {
          throw new ConflictException(
            'Cannot remove slot because all slots are occupied',
          );
        }

        if (role.slots === 1) {
          await prisma.projectRole.delete({
            where: { id },
          });
          return;
        }

        await prisma.projectRole.update({
          where: { id },
          data: {
            slots: {
              decrement: 1,
            },
          },
          include: {
            roleType: true,
          },
        });
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2025') {
        throw new NotFoundException('Project role not found');
      }
      throw error;
    }
  }

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
