'use client';

import { ReactElement, useCallback, useEffect, useState } from 'react';
import styles from './BoardClient.module.scss';
import { useParams } from 'next/navigation';
import {
  useCreateColumnMutation,
  useGetBoardQuery,
  useUpdateColumnsOrderMutation,
} from '@/api/boardsApi';
import { useRouter } from '@/i18n/routing';
import ListSkeleton from '@/shared/components/ListSkeleton/ListSkeleton';
import Button from '@/shared/components/Button/Button';
import Plus from '@/assets/icons/plus.svg';
import Column from './Column/Column';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useGetProjectByIdQuery } from '@/api/projectsApi';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { TaskStatusWithCountInterface } from '@/shared/interfaces/task-status-with-count.interface';
import { useToast } from '@/hooks/useToast';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { useShortLocale } from '@/hooks/useShortLocale';
import { useTranslations } from 'next-intl';
import CreateTaskPopup from './CreateTaskPopup/CreateTaskPopup';
import { useMoveTaskMutation } from '@/api/tasksApi';
import { TaskInterface } from '@/shared/interfaces/task.interface';
import { TaskStatusInterface } from '@/shared/interfaces/task-status.interface';

export default function BoardClient(): ReactElement {
  const { projectId, boardId } = useParams<{
    projectId: string;
    boardId: string;
  }>();
  const { data: board, isLoading: boardLoading } = useGetBoardQuery(boardId);
  const router = useRouter();
  const buttonDisabled = Number(board?.columns.length) >= 5;
  const [columns, setColumns] = useState<TaskStatusWithCountInterface[]>([]);
  const { data: project, isLoading: projectLoading } =
    useGetProjectByIdQuery(projectId);
  const user = useAppSelector(authSelector.selectRequiredUser);
  const isOwner = project?.ownerId === user.id;
  const [reorderColumns] = useUpdateColumnsOrderMutation();
  const [moveTask] = useMoveTaskMutation();
  const isLoading = projectLoading || boardLoading;
  const [createColumn, { isLoading: createColumnLoading }] =
    useCreateColumnMutation();
  const { showToast, isActive } = useToast();
  const locale = useShortLocale();
  const [createTaskColumnId, setCreateTaskColumnId] = useState<string | null>(
    null,
  );
  const members = [
    ...(project?.roles.flatMap((role) => role.users) ?? []),
    ...(project?.owner ? [project.owner] : []),
  ];
  const [tasksByColumn, setTasksByColumn] = useState<
    Record<string, TaskInterface[]>
  >({});
  const t = useTranslations('boards');

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

  const syncColumnTasks = useCallback(
    (columnId: string, loadedTasks: TaskInterface[]) => {
      setTasksByColumn((prev) => {
        const existingIds = new Set(
          Object.values(prev)
            .flat()
            .map((task) => task.id),
        );
        const currentTasks = prev[columnId] ?? [];
        const newTasks = loadedTasks.filter(
          (task) => !existingIds.has(task.id),
        );

        if (newTasks.length === 0) {
          return prev;
        }

        return {
          ...prev,
          [columnId]: [...currentTasks, ...newTasks].sort(
            (a, b) => a.taskIndex - b.taskIndex,
          ),
        };
      });
    },
    [],
  );

  const updateTasksAfterMove = (
    currentTasks: Record<string, TaskInterface[]>,
    {
      taskId,
      oldColumnId,
      oldIndex,
      newColumnId,
      newIndex,
      newTaskStatus,
    }: {
      taskId: string;
      oldColumnId: string;
      oldIndex: number;
      newColumnId: string;
      newIndex: number;
      newTaskStatus: TaskStatusInterface;
    },
  ): Record<string, TaskInterface[]> => {
    const oldTasks = [...(currentTasks[oldColumnId] ?? [])];

    const movedTask = oldTasks.find((task) => task.id === taskId);

    if (!movedTask) {
      return currentTasks;
    }

    if (oldColumnId === newColumnId) {
      const updatedTasks = oldTasks
        .filter((task) => task.id !== taskId)
        .map((task) => {
          if (
            oldIndex < newIndex &&
            task.taskIndex > oldIndex &&
            task.taskIndex <= newIndex
          ) {
            return {
              ...task,
              taskIndex: task.taskIndex - 1,
            };
          }

          if (
            oldIndex > newIndex &&
            task.taskIndex >= newIndex &&
            task.taskIndex < oldIndex
          ) {
            return {
              ...task,
              taskIndex: task.taskIndex + 1,
            };
          }

          return task;
        });

      updatedTasks.push({
        ...movedTask,
        taskIndex: newIndex,
        taskStatus: newTaskStatus,
      });

      return {
        ...currentTasks,
        [oldColumnId]: updatedTasks.sort((a, b) => a.taskIndex - b.taskIndex),
      };
    }

    const newTasks = [...(currentTasks[newColumnId] ?? [])];

    const updatedOldTasks = oldTasks
      .filter((task) => task.id !== taskId)
      .map((task) => {
        if (task.taskIndex > oldIndex) {
          return {
            ...task,
            taskIndex: task.taskIndex - 1,
          };
        }

        return task;
      });

    const updatedNewTasks = newTasks
      .filter((task) => task.id !== taskId)
      .map((task) => {
        if (task.taskIndex >= newIndex) {
          return {
            ...task,
            taskIndex: task.taskIndex + 1,
          };
        }

        return task;
      });

    updatedNewTasks.push({
      ...movedTask,
      taskStatus: newTaskStatus,
      taskIndex: newIndex,
    });

    return {
      ...currentTasks,
      [oldColumnId]: updatedOldTasks.sort((a, b) => a.taskIndex - b.taskIndex),
      [newColumnId]: updatedNewTasks.sort((a, b) => a.taskIndex - b.taskIndex),
    };
  };

  const openCreateTaskPopup = (id: string): void => {
    setCreateTaskColumnId(id);
  };

  const closeCreateTaskPopup = (): void => {
    setCreateTaskColumnId(null);
  };

  const addColumn = async (): Promise<void> => {
    if (isActive(ToastKeysEnum.STATUS)) {
      return;
    }

    try {
      await createColumn({
        boardId,
        locale,
      }).unwrap();
    } catch {
      showToast({
        severity: 'error',
        summary: 'Помилка створення колонки',
        life: 3000,
        actionKey: ToastKeysEnum.BOARD,
      });
    }
  };

  const handleDragEnd = async (result: DropResult): Promise<void> => {
    const { source, destination, type } = result;

    if (!destination) {
      return;
    }

    if (type === 'COLUMN') {
      if (source.index === destination.index) {
        return;
      }

      const previousColumns = columns;
      const reorderedColumns = [...columns];
      const [movedColumn] = reorderedColumns.splice(source.index, 1);
      reorderedColumns.splice(destination.index, 0, movedColumn);
      const updatedColumns = reorderedColumns.map((column, index) => ({
        ...column,
        columnIndex: index + 1,
      }));
      setColumns(updatedColumns);

      if (!board) {
        return;
      }

      try {
        await reorderColumns({
          id: board.id,
          data: {
            projectId,
            columns: updatedColumns.map((column) => ({
              id: column.id,
              columnIndex: column.columnIndex,
            })),
          },
        }).unwrap();
      } catch {
        setColumns(previousColumns);
      }
      return;
    }

    if (type === 'TASK') {
      const oldColumnId = source.droppableId;
      const newColumnId = destination.droppableId;
      const oldIndex = source.index + 1;
      const newIndex = destination.index + 1;
      if (oldColumnId === newColumnId && source.index === destination.index) {
        return;
      }

      const newTaskStatus = columns.find((column) => column.id === newColumnId);
      if (!newTaskStatus) {
        return;
      }

      const task = (tasksByColumn[oldColumnId] ?? [])[source.index];
      if (!task) {
        return;
      }

      const previousTasks = tasksByColumn;
      setTasksByColumn((currentTasks) =>
        updateTasksAfterMove(currentTasks, {
          taskId: task.id,
          oldColumnId,
          oldIndex,
          newColumnId,
          newIndex,
          newTaskStatus,
        }),
      );

      try {
        await moveTask({
          id: task.id,
          boardId,
          data: {
            oldIndex,
            oldColumnId,
            newIndex,
            newColumnId,
          },
        }).unwrap();
      } catch (error) {
        setTasksByColumn(previousTasks);
        console.error('Failed to move task:', error);
        showToast({
          severity: 'error',
          summary: 'Помилка переміщення задачі',
          life: 3000,
          actionKey: ToastKeysEnum.BOARD,
        });
      }
    }
  };

  return isLoading ? (
    <ListSkeleton itemHeight={44} noPadding columns={1} />
  ) : (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles['board-client__wrapper']}>
          <div className={styles['board-client']}>
            <Droppable
              droppableId="board-columns"
              direction="horizontal"
              type="COLUMN"
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={styles['board-client__droppable']}
                >
                  {columns.map((column, index) => (
                    <Column
                      key={column.id}
                      currentColumn={column}
                      tasks={tasksByColumn[column.id] ?? []}
                      columns={columns}
                      index={index}
                      isOwner={isOwner}
                      addTask={() => openCreateTaskPopup(column.id)}
                      onTasksLoaded={syncColumnTasks}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {isOwner && (
              <Button
                color="green"
                variant="secondary-frame"
                icon={<Plus />}
                disabled={buttonDisabled}
                loading={createColumnLoading}
                onClick={addColumn}
              >
                {!buttonDisabled && t('columnBtn')}
              </Button>
            )}
          </div>
        </div>
      </DragDropContext>
      {createTaskColumnId && (
        <CreateTaskPopup
          isOpen={!!createTaskColumnId}
          onClose={closeCreateTaskPopup}
          members={members}
          columns={columns}
          initialColumnId={createTaskColumnId}
          boardId={boardId}
        />
      )}
    </>
  );
}
