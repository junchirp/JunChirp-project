'use client';

import { ReactElement } from 'react';
import styles from './Column.module.scss';
import { COLUMN_COLOR_SCHEMES } from '@/shared/constants/column-color-schemes';
import Image from 'next/image';
import { useSortable } from '@dnd-kit/react/sortable';
import { TaskStatusInterface } from '@/shared/interfaces/task-status.interface';

interface ColumnProps {
  column: TaskStatusInterface;
  index: number;
  isOwner: boolean;
}

export default function Column({
  column,
  index,
  isOwner,
}: ColumnProps): ReactElement {
  const { ref, handleRef, isDragging } = useSortable({
    id: column.id,
    index,
  });
  const colorScheme = COLUMN_COLOR_SCHEMES[column.color];

  return (
    <div ref={ref} className={styles.column} data-dragging={isDragging}>
      <div className={styles.column__header}>
        <div className={styles['column__title-wrapper']}>
          <p
            className={styles.column__title}
            style={{
              color: colorScheme.text,
              backgroundColor: colorScheme.background,
            }}
          >
            {column.statusName}
          </p>
          <p className={styles['column__tasks-number']}>{column.tasksCount}</p>
        </div>
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
          {isOwner && (
            <>
              <button className={styles.column__button}>
                <Image
                  width={16}
                  height={16}
                  src="/images/dots.svg"
                  alt="dots"
                />
              </button>
              <button className={styles.column__button}>
                <Image
                  width={16}
                  height={16}
                  src="/images/plus.svg"
                  alt="plus"
                />
              </button>
            </>
          )}
        </div>
      </div>
      {!!column.tasksCount && <div></div>}
    </div>
  );
}
