import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ProjectRoleTypeResponseDto } from './dto/project-role-type.response-dto';
import { ProjectRoleMapper } from '../common/mappers/project-role.mapper';
import { CreateProjectRoleDto } from './dto/create-project-role.dto';
import { ProjectRoleResponseDto } from './dto/project-role.response-dto';
import { throwPrismaError } from '../common/utils/throw-prisma-error';

@Injectable()
export class ProjectRolesService {
  public constructor(private readonly prisma: PrismaService) {}

  public async getProjectRoleTypes(): Promise<ProjectRoleTypeResponseDto[]> {
    return this.prisma.projectRoleType.findMany({
      where: {
        roleName: {
          not: 'Project owner',
        },
      },
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
      throwPrismaError(error, [
        {
          code: 'P2003',
          exception: NotFoundException,
          message: 'Project or role type not found',
        },
        {
          code: 'P2002',
          exception: ConflictException,
          message: 'This role already exists in the project',
        },
      ]);
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
      throwPrismaError(error, {
        code: 'P2025',
        exception: NotFoundException,
        message: 'Project role not found',
      });
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
      throwPrismaError(error, {
        code: 'P2025',
        exception: NotFoundException,
        message: 'Project role not found',
      });
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
      throwPrismaError(error, [
        {
          code: 'P2025',
          exception: NotFoundException,
          message: 'Project role not found or already removed',
        },
        {
          code: 'P2003',
          exception: BadRequestException,
          message: 'Cannot update or delete roles due to related constraints',
        },
      ]);
    }
  }
}
