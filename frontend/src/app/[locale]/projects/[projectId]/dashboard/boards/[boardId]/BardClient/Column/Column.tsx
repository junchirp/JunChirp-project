'use client';

import { ReactElement, useEffect, useRef, useState } from 'react';
import styles from './Column.module.scss';
import { COLUMN_COLOR_SCHEMES } from '@/shared/constants/column-color-schemes';
import Image from 'next/image';
import { useSortable } from '@dnd-kit/react/sortable';
import { TaskStatusWithCountInterface } from '@/shared/interfaces/task-status-with-count.interface';
import ColumnMenu from './ColumnMenu/ColumnMenu';
import ColumnForm from './ColumnForm/ColumnForm';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { useToast } from '@/hooks/useToast';
import { useDeleteColumnMutation } from '@/api/boardsApi';
import { useTranslations } from 'next-intl';
import DeleteColumnPopup from './DeleteColumnPopup/DeleteColumnPopup';
import { useGetTasksInfiniteQuery } from '@/api/tasksApi';
import Task from './Task/Task';

interface ColumnProps {
  currentColumn: TaskStatusWithCountInterface;
  index: number;
  isOwner: boolean;
  columns: TaskStatusWithCountInterface[];
  addTask: () => void;
}

export default function Column(props: ColumnProps): ReactElement {
  const { currentColumn, columns, addTask, isOwner, index } = props;
  const { ref, handleRef, isDragging } = useSortable({
    id: currentColumn.id,
    index,
    disabled: !isOwner,
  });
  const colorScheme = COLUMN_COLOR_SCHEMES[currentColumn.color];
  const [isEditMode, setEditMode] = useState(false);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const { showToast, isActive } = useToast();
  const [deleteColumn, { isLoading }] = useDeleteColumnMutation();
  const t = useTranslations('boards');
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetTasksInfiniteQuery(currentColumn.id);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const tasksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = loadMoreRef.current;
    const root = tasksRef.current;

    if (!element || !root) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      {
        root,
        threshold: 0,
      },
    );
    observer.observe(element);

    return (): void => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleDeleteColumn = async (): Promise<void> => {
    if (isActive(ToastKeysEnum.STATUS) || isLoading) {
      return;
    }

    try {
      setIsOpenPopup(false);
      await deleteColumn({
        id: currentColumn.id,
        boardId: currentColumn.boardId,
      }).unwrap();

      showToast({
        severity: 'success',
        summary: t('deleteColumn.success'),
        life: 3000,
        actionKey: ToastKeysEnum.STATUS,
      });
    } catch {
      showToast({
        severity: 'error',
        summary: t('deleteColumn.error'),
        detail: t('deleteColumn.errorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.STATUS,
      });
    }
  };

  const handleDeleteColumnRequest = async (): Promise<void> => {
    const hasTasks = currentColumn.tasksCount > 0;

    if (hasTasks) {
      setIsOpenPopup(true);
      return;
    }

    await handleDeleteColumn();
  };

  return (
    <>
      <div ref={ref} className={styles.column} data-dragging={isDragging}>
        <div className={styles.column__header}>
          <div className={styles['column__title-wrapper']}>
            {isEditMode ? (
              <ColumnForm
                currentColumn={currentColumn}
                columns={columns}
                onClose={() => setEditMode(false)}
              />
            ) : (
              <p
                className={styles.column__title}
                style={{
                  color: colorScheme.text,
                  backgroundColor: colorScheme.background,
                }}
              >
                {currentColumn.statusName}
              </p>
            )}
            <p className={styles['column__tasks-number']}>
              {currentColumn.tasksCount}
            </p>
          </div>
          {isOwner && (
            <div className={styles.column__actions}>
              <button
                className={`${styles.column__button} ${styles['column__button--drag']}`}
                ref={handleRef}
              >
                <Image
                  width={16}
                  height={16}
                  src="/images/plus-arrows.svg"
                  alt="arrows"
                />
              </button>
              <ColumnMenu
                currentColumn={currentColumn}
                columnsCount={columns.length}
                onDelete={handleDeleteColumnRequest}
                onRename={() => setEditMode(true)}
              />
              <button className={styles.column__button} onClick={addTask}>
                <Image
                  width={16}
                  height={16}
                  src="/images/plus.svg"
                  alt="plus"
                />
              </button>
            </div>
          )}
        </div>
        {!!currentColumn.tasksCount && (
          <div ref={tasksRef} className={styles.column__tasks}>
            {data?.pages.flatMap((page) =>
              page.tasks.map((task) => <Task key={task.id} task={task} />),
            )}
            {hasNextPage && <div ref={loadMoreRef} />}
          </div>
        )}
      </div>
      <DeleteColumnPopup
        isOpen={isOpenPopup}
        column={currentColumn}
        onClose={() => setIsOpenPopup(false)}
        onConfirm={handleDeleteColumn}
        loading={isLoading}
      />
    </>
  );
}
