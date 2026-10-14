'use client';

import { ReactElement } from 'react';
import styles from './Task.module.scss';
import { TaskInterface } from '@/shared/interfaces/task.interface';
import { TASK_PRIORITY_CONFIG } from '@/shared/constants/task-priority-config';
import Flag from '@/assets/icons/flag.svg';
import Button from '@/shared/components/Button/Button';
import More from '@/assets/icons/more-horizontal.svg';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import { getAssigneeColor } from '@/shared/utils/getAssigneeColor';
import Tooltip from '@/shared/components/Tooltip/Tooltip';
import { Draggable } from '@hello-pangea/dnd';

interface TaskProps {
  task: TaskInterface;
  index: number;
}

export default function Task({ task, index }: TaskProps): ReactElement {
  const priority = TASK_PRIORITY_CONFIG[task.priority];
  const t = useTranslations('taskPriority');
  const format = useFormatter();
  const formattedDate = format.dateTime(new Date(task.deadline), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${styles.task} ${
            snapshot.isDragging ? styles['task--dragging'] : ''
          }`}
          data-dragging={snapshot.isDragging}
        >
          <div className={styles['task__header-wrapper']}>
            <div className={styles.task__header}>
              <div className={styles.task__priority}>
                <Flag
                  width={24}
                  height={24}
                  style={{ color: priority.color }}
                />
                <p className={styles['task__priority-text']}>
                  {t(task.priority)}
                </p>
              </div>
              <Button
                size="ssm"
                color="green"
                variant="tertiary"
                icon={<More />}
              />
            </div>
            <h6 className={styles.task__title}>{task.taskName}</h6>
          </div>
          <div className={styles.task__footer}>
            {task.deadline && (
              <div className={styles.task__deadline}>
                <Image
                  src="/images/calendar.svg"
                  width={16}
                  height={16}
                  alt="calendar"
                />
                <span>{formattedDate}</span>
              </div>
            )}
            {task.assignee && (
              <div className={styles['task__assignee-wrapper']}>
                <Tooltip
                  content={
                    <p className={styles.task__tooltip}>
                      {task.assignee.firstName} {task.assignee.lastName}
                    </p>
                  }
                >
                  <div
                    className={styles.task__assignee}
                    style={{
                      backgroundColor: getAssigneeColor(task.assignee.id)
                        .background,
                      color: getAssigneeColor(task.assignee.id).text,
                    }}
                  >
                    <p>{task.assignee.firstName.charAt(0).toUpperCase()}</p>
                    <p>{task.assignee.lastName.charAt(0).toUpperCase()}</p>
                  </div>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
