import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TaskMapper } from '../common/mappers/task.mapper';
import { TaskResponseDto } from './dto/task.response-dto';
import { throwPrismaError } from '../common/utils/throw-prisma-error';
import { isPrismaUniqueConstraintConflict } from '../common/utils/is-prisma-unique-constraint-conflict';
import { TaskListResponseDto } from './dto/task-list.response-dto';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { Prisma } from '@prisma/client';
import { isPrismaError } from '../common/utils/is-prisma-error';
import { ProjectsGateway } from '../projects/projects.gateway';

@Injectable()
export class TasksService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly projectsGateway: ProjectsGateway,
  ) {}

  public async createTask(
    authorId: string,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    const taskStatus = await this.prisma.taskStatus.findUnique({
      where: {
        id: createTaskDto.taskStatusId,
      },
      select: {
        board: {
          select: {
            project: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    if (!taskStatus) {
      throw new NotFoundException('Task status not found');
    }

    if (taskStatus.board.project.status === 'done') {
      throw new ForbiddenException(
        'Cannot create a task in a completed project',
      );
    }

    const maxAttempts = 3;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const tasksCount = await this.prisma.task.count({
          where: {
            taskStatusId: createTaskDto.taskStatusId,
          },
        });

        const task = await this.prisma.task.create({
          data: {
            ...createTaskDto,
            authorId,
            taskIndex: tasksCount + 1,
          },
          include: {
            taskStatus: true,
            assignee: {
              include: {
                desiredRoles: true,
              },
            },
          },
        });

        this.projectsGateway.notifyTasksUpdated(task.taskStatus.boardId, {
          type: 'task.created',
          taskId: task.id,
          columnId: task.taskStatus.id,
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
            message: 'Task status or assignee not found',
          },
        ]);
      }
    }

    throw new ConflictException('Failed to create task');
  }

  public async updateTask(
    id: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await this.prisma.$transaction(
          async (prisma) => {
            const task = await prisma.task.findUniqueOrThrow({
              where: { id },
              select: {
                authorId: true,
                taskStatusId: true,
                taskIndex: true,
                taskStatus: {
                  select: {
                    boardId: true,
                    board: {
                      select: {
                        project: {
                          select: {
                            ownerId: true,
                            status: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            });

            if (
              task.authorId !== userId &&
              task.taskStatus.board.project.ownerId !== userId
            ) {
              throw new ForbiddenException(
                'You are not allowed to edit this task',
              );
            }

            if (task.taskStatus.board.project.status === 'done') {
              throw new ForbiddenException(
                'Cannot edit tasks in a completed project',
              );
            }

            const oldColumnId = task.taskStatusId;
            const newColumnId = updateTaskDto.taskStatusId;
            const columnChanged = oldColumnId !== newColumnId;

            if (columnChanged) {
              const newColumn = await prisma.taskStatus.findUnique({
                where: { id: newColumnId },
                select: {
                  boardId: true,
                },
              });

              if (!newColumn) {
                throw new NotFoundException('Task status not found');
              }

              if (newColumn.boardId !== task.taskStatus.boardId) {
                throw new BadRequestException(
                  'Task status must belong to the same board',
                );
              }

              const lastTask = await prisma.task.aggregate({
                where: {
                  taskStatusId: newColumnId,
                },
                _max: {
                  taskIndex: true,
                },
              });
              const newTaskIndex = (lastTask._max.taskIndex ?? 0) + 1;
              const updatedTask = await prisma.task.update({
                where: { id },
                data: {
                  ...updateTaskDto,
                  taskIndex: newTaskIndex,
                },
                include: {
                  taskStatus: true,
                  assignee: {
                    include: {
                      desiredRoles: true,
                    },
                  },
                },
              });

              await prisma.task.updateMany({
                where: {
                  taskStatusId: oldColumnId,
                  taskIndex: {
                    gt: task.taskIndex,
                  },
                },
                data: {
                  taskIndex: {
                    decrement: 1,
                  },
                },
              });

              return {
                task: updatedTask,
                boardId: task.taskStatus.boardId,
                oldColumnId,
                newColumnId,
                columnChanged: true,
              };
            }

            const updatedTask = await prisma.task.update({
              where: { id },
              data: updateTaskDto,
              include: {
                taskStatus: true,
                assignee: {
                  include: {
                    desiredRoles: true,
                  },
                },
              },
            });

            return {
              task: updatedTask,
              boardId: task.taskStatus.boardId,
              oldColumnId,
              newColumnId,
              columnChanged: false,
            };
          },
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          },
        );

        if (result.columnChanged) {
          this.projectsGateway.notifyTasksUpdated(result.boardId, {
            type: 'task.moved',
            taskId: id,
            oldColumnId: result.oldColumnId,
            newColumnId: result.newColumnId,
          });
        } else {
          this.projectsGateway.notifyTasksUpdated(result.boardId, {
            type: 'task.updated',
            taskId: id,
            columnId: result.newColumnId,
          });
        }

        return TaskMapper.toResponse(result.task);
      } catch (error) {
        if (
          isPrismaError(error) &&
          error.code === 'P2034' &&
          attempt < maxAttempts
        ) {
          continue;
        }

        throwPrismaError(error, [
          {
            code: 'P2025',
            exception: NotFoundException,
            message: 'Task not found',
          },
          {
            code: 'P2003',
            exception: NotFoundException,
            message: 'Task status or assignee not found',
          },
          {
            code: 'P2034',
            exception: ConflictException,
            message: 'Transaction conflict. Please try again',
          },
        ]);
      }
    }

    throw new ConflictException('Failed to update task');
  }

  public async deleteTask(id: string, userId: string): Promise<void> {
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const deletedTask = await this.prisma.$transaction(
          async (prisma) => {
            const task = await prisma.task.findUniqueOrThrow({
              where: { id },
              select: {
                id: true,
                authorId: true,
                taskStatusId: true,
                taskIndex: true,
                taskStatus: {
                  select: {
                    boardId: true,
                    board: {
                      select: {
                        project: {
                          select: {
                            ownerId: true,
                            status: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            });

            if (
              task.authorId !== userId &&
              task.taskStatus.board.project.ownerId !== userId
            ) {
              throw new ForbiddenException(
                'You are not allowed to delete this task',
              );
            }

            if (task.taskStatus.board.project.status === 'done') {
              throw new ForbiddenException(
                'Cannot delete tasks in a completed project',
              );
            }

            await prisma.task.delete({
              where: { id },
            });

            await prisma.task.updateMany({
              where: {
                taskStatusId: task.taskStatusId,
                taskIndex: {
                  gt: task.taskIndex,
                },
              },
              data: {
                taskIndex: {
                  decrement: 1,
                },
              },
            });

            return {
              taskId: task.id,
              columnId: task.taskStatusId,
              boardId: task.taskStatus.boardId,
            };
          },
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          },
        );

        this.projectsGateway.notifyTasksUpdated(deletedTask.boardId, {
          type: 'task.deleted',
          taskId: deletedTask.taskId,
          columnId: deletedTask.columnId,
        });
        return;
      } catch (error) {
        if (
          isPrismaError(error) &&
          error.code === 'P2034' &&
          attempt < maxAttempts
        ) {
          continue;
        }

        throwPrismaError(error, [
          {
            code: 'P2025',
            exception: NotFoundException,
            message: 'Task not found',
          },
          {
            code: 'P2034',
            exception: ConflictException,
            message: 'Transaction conflict. Please try again',
          },
        ]);
      }
    }

    throw new ConflictException('Failed to delete task');
  }

  public async getTasksByStatus(
    taskStatusId: string,
    query: CursorPaginationDto,
  ): Promise<TaskListResponseDto> {
    const { cursor, limit = 20 } = query;
    const cursorTask =
      cursor !== undefined
        ? await this.prisma.task.findFirst({
            where: {
              id: cursor,
              taskStatusId,
            },
            select: {
              taskIndex: true,
            },
          })
        : null;

    const tasks = await this.prisma.task.findMany({
      where: {
        taskStatusId,
        ...(cursorTask && {
          taskIndex: {
            gte: cursorTask.taskIndex,
          },
        }),
      },
      orderBy: {
        taskIndex: 'asc',
      },
      take: limit + 1,
      include: {
        taskStatus: true,
        assignee: {
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

  public async moveTask(id: string, moveTaskDto: MoveTaskDto): Promise<void> {
    const { oldIndex, oldColumnId, newIndex, newColumnId, boardId } =
      moveTaskDto;
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.prisma.$transaction(
          async (prisma) => {
            const task = await prisma.task.findUniqueOrThrow({
              where: { id },
              select: {
                taskStatusId: true,
                taskIndex: true,
              },
            });

            const columns = await prisma.taskStatus.findMany({
              where: {
                id: { in: [oldColumnId, newColumnId] },
              },
              select: {
                id: true,
                boardId: true,
                board: {
                  select: {
                    project: {
                      select: {
                        status: true,
                      },
                    },
                  },
                },
              },
            });

            const expectedColumnCount = oldColumnId === newColumnId ? 1 : 2;

            if (columns.length !== expectedColumnCount) {
              throw new NotFoundException('Column not found');
            }

            const oldColumn = columns.find(
              (column) => column.id === oldColumnId,
            );

            const newColumn = columns.find(
              (column) => column.id === newColumnId,
            );

            if (
              oldColumn?.boardId !== boardId ||
              newColumn?.boardId !== boardId
            ) {
              throw new BadRequestException(
                'Columns must belong to the specified board',
              );
            }

            if (oldColumn?.board.project.status === 'done') {
              throw new ForbiddenException(
                'Cannot move tasks in a completed project',
              );
            }

            if (
              task.taskStatusId !== oldColumnId ||
              task.taskIndex !== oldIndex
            ) {
              throw new ConflictException(
                'Transaction conflict. Please try again.',
              );
            }

            if (oldColumnId === newColumnId && oldIndex === newIndex) {
              return;
            }

            if (oldColumnId === newColumnId) {
              if (oldIndex < newIndex) {
                await prisma.task.updateMany({
                  where: {
                    taskStatusId: oldColumnId,
                    taskIndex: { gt: oldIndex, lte: newIndex },
                  },
                  data: { taskIndex: { decrement: 1 } },
                });
              } else {
                await prisma.task.updateMany({
                  where: {
                    taskStatusId: oldColumnId,
                    taskIndex: { gte: newIndex, lt: oldIndex },
                  },
                  data: { taskIndex: { increment: 1 } },
                });
              }
            } else {
              await prisma.task.updateMany({
                where: {
                  taskStatusId: newColumnId,
                  taskIndex: { gte: newIndex },
                },
                data: { taskIndex: { increment: 1 } },
              });
              await prisma.task.updateMany({
                where: {
                  taskStatusId: oldColumnId,
                  taskIndex: { gt: oldIndex },
                },
                data: { taskIndex: { decrement: 1 } },
              });
            }
            await prisma.task.update({
              where: { id },
              data: {
                taskStatusId: newColumnId,
                taskIndex: newIndex,
              },
            });
          },
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          },
        );

        if (oldColumnId !== newColumnId || oldIndex !== newIndex) {
          this.projectsGateway.notifyTasksUpdated(boardId, {
            type: 'task.moved',
            taskId: id,
            oldColumnId,
            newColumnId,
          });
        }

        return;
      } catch (error) {
        if (
          isPrismaError(error) &&
          error.code === 'P2034' &&
          attempt < maxAttempts
        ) {
          continue;
        }

        throwPrismaError(error, [
          {
            code: 'P2025',
            exception: NotFoundException,
            message: 'Task not found',
          },
          {
            code: 'P2034',
            exception: ConflictException,
            message: 'Transaction conflict. Please try again.',
          },
        ]);
      }
    }
  }
}
