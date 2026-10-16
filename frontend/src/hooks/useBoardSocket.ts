'use client';

import { useCallback, useEffect } from 'react';
import { boardsSocket } from '@/api/boardsSocketApi';
import { tasksApi } from '@/api/tasksApi';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { boardsApi } from '@/api/boardsApi';

interface BoardUpdatedPayload {
  type: string;
  boardId: string;
  projectId?: string;
}

interface TasksUpdatedPayload {
  type: string;
  taskId: string;
  oldColumnId?: string;
  newColumnId?: string;
  columnId?: string;
}

export function useBoardSocket(boardId: string): void {
  const dispatch = useAppDispatch();

  const handleBoardUpdated = useCallback(
    (payload: BoardUpdatedPayload) => {
      switch (payload.type) {
        case 'board.created':
        case 'board.deleted':
          dispatch(
            boardsApi.util.invalidateTags([
              { type: 'boards', id: payload.projectId },
            ]),
          );
          break;
        case 'board.renamed':
          dispatch(
            boardsApi.util.invalidateTags([
              { type: 'board', id: payload.boardId },
              { type: 'boards', id: payload.projectId },
            ]),
          );
          break;
        case 'board.updated': // columns actions (add, delete, rename, reorder)
          dispatch(
            boardsApi.util.invalidateTags([
              { type: 'board', id: payload.boardId },
            ]),
          );
          break;
        default:
          return;
      }
    },
    [dispatch, boardId],
  );

  const handleTasksUpdated = useCallback(
    (payload: TasksUpdatedPayload) => {
      let columnIds: string[] = [];
      switch (payload.type) {
        case 'task.moved':
          columnIds = [payload.oldColumnId, payload.newColumnId].filter(
            (id): id is string => Boolean(id),
          );
          break;
        case 'task.created':
          // TODO: case 'task.deleted':
          if (payload.columnId) {
            columnIds = [payload.columnId];
          }
          break;
        // TODO: case 'task.updated':
        default:
          return;
      }

      dispatch(
        tasksApi.util.invalidateTags(
          [...new Set(columnIds)].map((id) => ({ type: 'tasks', id })),
        ),
      );

      dispatch(boardsApi.util.invalidateTags([{ type: 'board', id: boardId }]));
    },
    [dispatch],
  );

  useEffect(() => {
    if (!boardId) {
      return;
    }

    const handleConnect = (): void => {
      boardsSocket.emit('board:join', { boardId });
    };

    boardsSocket.on('connect', handleConnect);
    boardsSocket.on('board:updated', handleBoardUpdated);
    boardsSocket.on('tasks:updated', handleTasksUpdated);

    if (boardsSocket.connected) {
      handleConnect();
    } else {
      boardsSocket.connect();
    }

    return (): void => {
      boardsSocket.off('connect', handleConnect);
      boardsSocket.off('board:updated', handleBoardUpdated);
      boardsSocket.off('tasks:updated', handleTasksUpdated);

      if (boardsSocket.connected) {
        boardsSocket.emit('board:leave', { boardId });
      }
    };
  }, [boardId, handleBoardUpdated, handleTasksUpdated]);
}
