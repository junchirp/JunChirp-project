'use client';

import { ReactElement } from 'react';
import styles from './ViewTaskPopup.module.scss';
import Dialog from '@/shared/components/Dialog/Dialog';
import DialogBody from '@/shared/components/Dialog/DialogBody/DialogBody';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';
import Button from '@/shared/components/Button/Button';
import { useFormatter, useTranslations } from 'next-intl';
import { TaskInterface } from '@/shared/interfaces/task.interface';
import { getAssigneeColor } from '@/shared/utils/getAssigneeColor';
import Flag from '@/assets/icons/flag.svg';
import { TASK_PRIORITY_CONFIG } from '@/shared/constants/task-priority-config';
import Image from 'next/image';

interface ViewTaskPopupProps {
  task: TaskInterface;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewTaskPopup(props: ViewTaskPopupProps): ReactElement {
  const { isOpen, onClose, task } = props;
  const format = useFormatter();
  const formattedDate = format.dateTime(new Date(task.deadline), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const priority = TASK_PRIORITY_CONFIG[task.priority];
  const tButtons = useTranslations('buttons');
  const tTask = useTranslations('task');
  const tPriority = useTranslations('taskPriority');

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogBody>
        <div className={styles['view-task-popup__body']}>
          <div>
            <label className={styles['view-task-popup__label']}>
              {tTask('taskName')}
            </label>
            <p>{task.taskName}</p>
          </div>
          {task.description && (
            <div>
              <label className={styles['view-task-popup__label']}>
                {tTask('description')}
              </label>
              <p>{task.description}</p>
            </div>
          )}
          <div>
            <label className={styles['view-task-popup__label']}>
              {tTask('status')}
            </label>
            <p>{task.taskStatus.statusName}</p>
          </div>
          {task.assignee && (
            <div>
              <label className={styles['view-task-popup__label']}>
                {tTask('assignee')}
              </label>
              <div className={styles['view-task-popup__assignee-wrapper']}>
                <div
                  className={styles['view-task-popup__assignee']}
                  style={{
                    backgroundColor: getAssigneeColor(task.assignee.id)
                      .background,
                    color: getAssigneeColor(task.assignee.id).text,
                  }}
                >
                  <p>{task.assignee.firstName.charAt(0).toUpperCase()}</p>
                  <p>{task.assignee.lastName.charAt(0).toUpperCase()}</p>
                </div>
                <p>
                  {task.assignee.firstName} {task.assignee.lastName}
                </p>
              </div>
            </div>
          )}
          <div>
            <label className={styles['view-task-popup__label']}>
              {tTask('priority')}
            </label>
            <div className={styles['view-task-popup__priority']}>
              <Flag width={24} height={24} style={{ color: priority.color }} />
              <p>{tPriority(task.priority)}</p>
            </div>
          </div>
          {task.deadline && (
            <div>
              <label className={styles['view-task-popup__label']}>
                {tTask('deadline')}
              </label>
              <div className={styles['view-task-popup__deadline']}>
                <Image
                  src="/images/calendar.svg"
                  width={16}
                  height={16}
                  alt="calendar"
                />
                <p>{formattedDate}</p>
              </div>
            </div>
          )}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button color="green" onClick={onClose}>
          {tButtons('close')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
