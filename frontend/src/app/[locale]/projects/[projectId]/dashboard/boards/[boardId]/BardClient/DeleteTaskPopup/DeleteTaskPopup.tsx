'use client';

import { ReactElement } from 'react';
import Dialog from '@/shared/components/Dialog/Dialog';
import DialogHeader from '@/shared/components/Dialog/DialogHeader/DialogHeader';
import DialogBody from '@/shared/components/Dialog/DialogBody/DialogBody';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';
import Button from '@/shared/components/Button/Button';
import { TaskInterface } from '@/shared/interfaces/task.interface';
import { useTranslations } from 'next-intl';
import styles from './DeleteTaskPopup.module.scss';
import { useDeleteTaskMutation } from '@/api/tasksApi';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { useToast } from '@/hooks/useToast';

interface DeleteTaskPopupProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskInterface;
}

export default function DeleteTaskPopup(
  props: DeleteTaskPopupProps,
): ReactElement {
  const { isOpen, onClose, task } = props;
  const [deleteTask, { isLoading }] = useDeleteTaskMutation();
  const { showToast, isActive } = useToast();
  const tPopup = useTranslations('deleteTaskPopup');
  const tButtons = useTranslations('buttons');

  const handleDeleteTask = async (): Promise<void> => {
    if (isActive(ToastKeysEnum.TASK) || isLoading) {
      return;
    }

    try {
      onClose();
      await deleteTask(task.id).unwrap();

      showToast({
        severity: 'success',
        summary: tPopup('success'),
        life: 3000,
        actionKey: ToastKeysEnum.TASK,
      });
    } catch {
      showToast({
        severity: 'error',
        summary: tPopup('error'),
        detail: tPopup('errorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.TASK,
      });
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader title={tPopup('title')} />
      <DialogBody>
        {tPopup.rich('description', {
          task: (chunks) => (
            <span className={styles['delete-task-popup__description']}>
              [{chunks}]
            </span>
          ),
          taskName: task.taskName,
        })}
      </DialogBody>
      <DialogFooter>
        <Button color="green" variant="secondary-frame" onClick={onClose}>
          {tButtons('cancel')}
        </Button>
        <Button color="green" onClick={handleDeleteTask}>
          {tButtons('delete')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
