import {
  type ProjectRoleType,
  type Task,
  type TaskStatus,
  type User,
} from '@prisma/client';
import { UserMapper } from './user.mapper';
import { type TaskResponseDto } from '../../tasks/dto/task.response-dto';
import { TaskStatusMapper } from './task-status.mapper';

export class TaskMapper {
  public static toResponse(
    task: Task & {
      assignee: (User & { desiredRoles: ProjectRoleType[] }) | null;
      taskStatus: TaskStatus;
    },
  ): TaskResponseDto {
    return {
      id: task.id,
      taskName: task.taskName,
      description: task.description,
      deadline: task.deadline,
      priority: task.priority,
      assignee: task.assignee ? UserMapper.toBaseResponse(task.assignee) : null,
      taskStatus: TaskStatusMapper.toBaseResponse(task.taskStatus),
      taskIndex: task.taskIndex,
    };
  }
}
