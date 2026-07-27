'use client';

import { ReactElement, useEffect, useState } from 'react';
import styles from './BoardClient.module.scss';
import { useParams } from 'next/navigation';
import {
  useGetBoardQuery,
  useUpdateColumnsOrderMutation,
} from '@/api/boardsApi';
import { useRouter } from '@/i18n/routing';
import ListSkeleton from '@/shared/components/ListSkeleton/ListSkeleton';
import Button from '@/shared/components/Button/Button';
import Plus from '@/assets/icons/plus.svg';
import Column from './Column/Column';
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import { useGetProjectByIdQuery } from '@/api/projectsApi';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { TaskStatusInterface } from '@/shared/interfaces/task-status.interface';

export default function BoardClient(): ReactElement {
  const { projectId, boardId } = useParams<{
    projectId: string;
    boardId: string;
  }>();
  const { data: board, isLoading: boardLoading } = useGetBoardQuery(boardId);
  const router = useRouter();
  const buttonDisabled = Number(board?.columns.length) >= 5;
  const [columns, setColumns] = useState<TaskStatusInterface[]>([]);
  const { data: project, isLoading: projectLoading } =
    useGetProjectByIdQuery(projectId);
  const user = useAppSelector(authSelector.selectRequiredUser);
  const isOwner = project?.ownerId === user.id;
  const [reorderColumns] = useUpdateColumnsOrderMutation();
  const isLoading = projectLoading || boardLoading;

  useEffect(() => {
    if (!isLoading && !board) {
      router.replace(`/projects/${projectId}/dashboard/boards`);
    }
  }, [board, projectId, router, isLoading]);

  useEffect(() => {
    if (board) {
      setColumns(board.columns);
    }
  }, [board]);

  const handleDragEnd = async (event: DragEndEvent): Promise<void> => {
    if (event.canceled) {
      return;
    }

    const { source } = event.operation;
    if (!isSortable(source)) {
      return;
    }

    const { initialIndex, index } = source;
    if (initialIndex === index) {
      return;
    }

    const newColumns = [...columns];

    const [movedColumn] = newColumns.splice(initialIndex, 1);
    newColumns.splice(index, 0, movedColumn);

    const reorderedColumns = newColumns.map((column, columnIndex) => ({
      ...column,
      columnIndex: columnIndex + 1, // якщо бекенд очікує індекси з 1
    }));

    setColumns(reorderedColumns);

    if (board) {
      try {
        await reorderColumns({
          id: board.id,
          data: {
            projectId,
            columns: reorderedColumns.map((column) => ({
              id: column.id,
              columnIndex: column.columnIndex,
            })),
          },
        }).unwrap();
      } catch {
        return;
      }
    }
  };

  return isLoading ? (
    <ListSkeleton itemHeight={160} noPadding columns={1} />
  ) : (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className={styles['board-client__wrapper']}>
        <div className={styles['board-client']}>
          <div className={styles['board-client__droppable']}>
            {columns.map((column, index) => (
              <Column
                key={column.id}
                column={column}
                index={index}
                isOwner={isOwner}
              />
            ))}
          </div>
          {isOwner && (
            <Button
              color="green"
              variant="secondary-frame"
              icon={<Plus />}
              disabled={buttonDisabled}
            >
              {!buttonDisabled && 'Додати колонку'}
            </Button>
          )}
        </div>
      </div>
    </DragDropProvider>
  );
}
