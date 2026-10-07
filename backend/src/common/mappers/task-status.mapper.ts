import { type TaskStatus } from '@prisma/client';
import { type TaskStatusResponseDto } from '../../boards/dto/task-status.response-dto';
import { type TaskStatusWithCountResponseDto } from '../../boards/dto/task-status-with-count.response-dto';

export class TaskStatusMapper {
  public static toBaseResponse(status: TaskStatus): TaskStatusResponseDto {
    return {
      id: status.id,
      statusName: status.statusName,
      columnIndex: status.columnIndex,
      boardId: status.boardId,
      color: status.color,
    };
  }

  public static toExpandResponse(
    status: TaskStatus & {
      _count: {
        tasks: number;
      };
    },
  ): TaskStatusWithCountResponseDto {
    return {
      id: status.id,
      statusName: status.statusName,
      columnIndex: status.columnIndex,
      boardId: status.boardId,
      color: status.color,
      tasksCount: status._count.tasks,
    };
  }
}
