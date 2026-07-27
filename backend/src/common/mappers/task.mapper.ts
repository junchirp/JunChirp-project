import { ProjectRoleType, Task, TaskStatus, User } from '@prisma/client';
import { TaskResponseDto } from '../../tasks/dto/task.response-dto';
import { UserMapper } from './user.mapper';
import { TaskWithStatusResponseDto } from '../../tasks/dto/task-with-status.response-dto';
import { TaskStatusMapper } from './task-status.mapper';

export class TaskMapper {
  public static toBaseResponse(
    task: Task & {
      assignees: (User & { desiredRoles: ProjectRoleType[] })[];
    },
  ): TaskResponseDto {
    return {
      id: task.id,
      taskName: task.taskName,
      description: task.description,
      deadline: task.deadline,
      priority: task.priority,
      assignees: task.assignees.map((assignee) =>
        UserMapper.toCardResponse(assignee),
      ),
      taskStatusId: task.taskStatusId,
      taskIndex: task.taskIndex,
    };
  }

  public static toExpandResponse(
    task: Task & {
      assignees: (User & { desiredRoles: ProjectRoleType[] })[];
      taskStatus: TaskStatus & {
        _count: {
          tasks: number;
        };
      };
    },
  ): TaskWithStatusResponseDto {
    return {
      id: task.id,
      taskName: task.taskName,
      description: task.description,
      deadline: task.deadline,
      priority: task.priority,
      assignees: task.assignees.map((assignee) =>
        UserMapper.toCardResponse(assignee),
      ),
      taskStatus: TaskStatusMapper.toBaseResponse(task.taskStatus),
      taskIndex: task.taskIndex,
    };
  }
}
