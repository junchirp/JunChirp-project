'use client';

import { useEffect } from 'react';
import { projectsSocket } from '@/api/projectsSocketApi';
import { boardsApi } from '@/api/boardsApi';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { useRouter } from '@/i18n/routing';

interface BoardsUpdatedPayload {
  type: string;
  projectId: string;
  boardId: string;
}

export function useProjectSocket(projectId: string, boardId?: string): void {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const handleConnect = (): void => {
      projectsSocket.emit('project:join', { projectId });
    };

    const handleBoardsUpdated = (payload: BoardsUpdatedPayload): void => {
      if (payload.projectId !== projectId) {
        return;
      }

      dispatch(
        boardsApi.util.invalidateTags([{ type: 'boards', id: projectId }]),
      );

      if (payload.type === 'board.deleted' && payload.boardId === boardId) {
        router.replace(`/projects/${projectId}/dashboard/boards`);
      }
    };

    projectsSocket.on('connect', handleConnect);
    projectsSocket.on('boards:updated', handleBoardsUpdated);

    if (projectsSocket.connected) {
      handleConnect();
    } else {
      projectsSocket.connect();
    }

    return (): void => {
      projectsSocket.off('connect', handleConnect);
      projectsSocket.off('boards:updated', handleBoardsUpdated);

      if (projectsSocket.connected) {
        projectsSocket.emit('project:leave', { projectId });
      }
    };
  }, [projectId, dispatch]);
}
