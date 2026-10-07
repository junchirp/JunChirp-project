import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TaskMapper } from '../common/mappers/task.mapper';
import { TaskResponseDto } from './dto/task.response-dto';
// import { UpdateStatusTaskDto } from './dto/update-status-task.dto';
import { throwPrismaError } from '../common/utils/throw-prisma-error';
import { isPrismaUniqueConstraintConflict } from '../common/utils/is-prisma-unique-constraint-conflict';
import { TaskListResponseDto } from './dto/task-list.response-dto';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';

@Injectable()
export class TasksService {
  public constructor(private readonly prisma: PrismaService) {}

  public async createTask(
    createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    const { assigneesIds, taskStatusId, ...taskData } = createTaskDto;
    const maxAttempts = 3;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const tasksCount = await this.prisma.task.count({
          where: {
            taskStatusId,
          },
        });

        const task = await this.prisma.task.create({
          data: {
            ...taskData,
            taskStatusId,
            taskIndex: tasksCount + 1,
            assignees: {
              connect: assigneesIds.map((id) => ({
                id,
              })),
            },
          },
          include: {
            taskStatus: {
              include: {
                _count: {
                  select: {
                    tasks: true,
                  },
                },
              },
            },
            assignees: {
              include: {
                desiredRoles: true,
              },
            },
          },
        });

        return TaskMapper.toResponse(task);
      } catch (error) {
        if (
          isPrismaUniqueConstraintConflict(error, [
            'taskStatusId',
            'taskIndex',
          ]) &&
          attempt < maxAttempts - 1
        ) {
          continue;
        }

        throwPrismaError(error, [
          {
            code: 'P2002',
            exception: ConflictException,
            message: `Failed to create task after ${maxAttempts} attempts`,
          },
          {
            code: 'P2003',
            exception: NotFoundException,
            message: 'Task status not found',
          },
          {
            code: 'P2025',
            exception: NotFoundException,
            message: 'Assignee not found',
          },
        ]);
      }
    }

    throw new ConflictException('Failed to create task');
  }

  // public async getTaskById(id: string): Promise<TaskWithStatusResponseDto> {
  //   try {
  //     const task = await this.prisma.task.findUniqueOrThrow({
  //       where: { id },
  //       include: {
  //         taskStatus: {
  //           include: {
  //             _count: {
  //               select: {
  //                 tasks: true,
  //               },
  //             },
  //           },
  //         },
  //         assignees: {
  //           include: {
  //             desiredRoles: true,
  //           },
  //         },
  //       },
  //     });
  //
  //     return TaskMapper.toExpandResponse(task);
  //   } catch (error) {
  //     throwPrismaError(error, {
  //       code: 'P2025',
  //       exception: NotFoundException,
  //       message: 'Task not found',
  //     });
  //   }
  // }

  // public async updateTask(
  //   id: string,
  //   updateTaskDto: UpdateTaskDto,
  // ): Promise<TaskWithStatusResponseDto> {
  //   try {
  //     const task = await this.prisma.task.update({
  //       where: { id },
  //       data: updateTaskDto,
  //       include: {
  //         taskStatus: {
  //           include: {
  //             _count: {
  //               select: {
  //                 tasks: true,
  //               },
  //             },
  //           },
  //         },
  //         assignees: {
  //           include: {
  //             desiredRoles: true,
  //           },
  //         },
  //       },
  //     });
  //
  //     return TaskMapper.toExpandResponse(task);
  //   } catch (error) {
  //     throwPrismaError(error, {
  //       code: 'P2025',
  //       exception: NotFoundException,
  //       message: 'Task not found',
  //     });
  //   }
  // }

  // public async deleteTask(id: string): Promise<void> {
  //   try {
  //     await this.prisma.task.delete({
  //       where: { id },
  //     });
  //   } catch (error) {
  //     throwPrismaError(error, {
  //       code: 'P2025',
  //       exception: NotFoundException,
  //       message: 'Task not found',
  //     });
  //   }
  // }

  // public async updateTaskStatus(
  //   id: string,
  //   updateStatusTaskDto: UpdateStatusTaskDto,
  // ): Promise<TaskWithStatusResponseDto> {
  //   try {
  //     await this.prisma.taskStatus.findUniqueOrThrow({
  //       where: { id: updateStatusTaskDto.taskStatusId },
  //     });
  //
  //     const task = await this.prisma.task.update({
  //       where: { id },
  //       data: updateStatusTaskDto,
  //       include: {
  //         taskStatus: {
  //           include: {
  //             _count: {
  //               select: {
  //                 tasks: true,
  //               },
  //             },
  //           },
  //         },
  //         assignees: {
  //           include: {
  //             desiredRoles: true,
  //           },
  //         },
  //       },
  //     });
  //
  //     return TaskMapper.toExpandResponse(task);
  //   } catch (error) {
  //     throwPrismaError(error, {
  //       code: 'P2025',
  //       exception: NotFoundException,
  //       message: 'Task or status not found',
  //     });
  //   }
  // }

  public async getTasksByStatus(
    taskStatusId: string,
    query: CursorPaginationDto,
  ): Promise<TaskListResponseDto> {
    const { cursor, limit = 20 } = query;
    const tasks = await this.prisma.task.findMany({
      where: {
        taskStatusId,
        ...(cursor !== undefined && {
          taskIndex: {
            gt: cursor,
          },
        }),
      },
      orderBy: {
        taskIndex: 'asc',
      },
      take: limit + 1,
      include: {
        taskStatus: true,
        assignees: {
          include: {
            desiredRoles: true,
          },
        },
      },
    });

    const hasNextPage = tasks.length > limit;
    const data = hasNextPage ? tasks.slice(0, limit) : tasks;

    return {
      tasks: data.map((task) => TaskMapper.toResponse(task)),
      cursor: hasNextPage ? data[data.length - 1].taskIndex : null,
    };
  }
}
