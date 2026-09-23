import {
  type ProjectRoleType,
  type Task,
  type TaskStatus,
  type User,
} from '@prisma/client';
import { type TaskStatusResponseDto } from '../../boards/dto/task-status.response-dto';
import { TaskMapper } from './task.mapper';
import { type TaskStatusWithTasksResponseDto } from '../../boards/dto/task-status-with-tasks.response-dto';

export class TaskStatusMapper {
  public static toBaseResponse(
    status: TaskStatus & {
      _count: {
        tasks: number;
      };
    },
  ): TaskStatusResponseDto {
    return {
      id: status.id,
      statusName: status.statusName,
      columnIndex: status.columnIndex,
      boardId: status.boardId,
      color: status.color,
      tasksCount: status._count.tasks,
    };
  }

  public static toExpandResponse(
    status: TaskStatus & {
      tasks: (Task & {
        assignees: (User & { desiredRoles: ProjectRoleType[] })[];
      })[];
    },
  ): TaskStatusWithTasksResponseDto {
    return {
      id: status.id,
      statusName: status.statusName,
      columnIndex: status.columnIndex,
      boardId: status.boardId,
      color: status.color,
      tasks: status.tasks.map((task) => TaskMapper.toBaseResponse(task)),
    };
  }
}
