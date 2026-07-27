import { Board, TaskStatus } from '@prisma/client';
import { BoardResponseDto } from '../../boards/dto/board.response-dto';
import { TaskStatusMapper } from './task-status.mapper';

export class BoardMapper {
  public static toResponse(
    board: Board & {
      columns: (TaskStatus & {
        _count: {
          tasks: number;
        };
      })[];
    },
  ): BoardResponseDto {
    return {
      id: board.id,
      boardName: board.boardName,
      projectId: board.projectId,
      columns: board.columns.map((column) =>
        TaskStatusMapper.toBaseResponse(column),
      ),
    };
  }
}
