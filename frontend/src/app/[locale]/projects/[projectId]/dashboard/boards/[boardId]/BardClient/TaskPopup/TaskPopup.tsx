'use client';

import { ReactElement } from 'react';
import Dialog from '@/shared/components/Dialog/Dialog';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';
import { UserBaseInterface } from '@/shared/interfaces/user-base.interface';
import { TaskStatusWithCountInterface } from '@/shared/interfaces/task-status-with-count.interface';
import TaskForm from './TaskForm/TaskForm';
import { TaskInterface } from '@/shared/interfaces/task.interface';

type CreateTaskPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  members: UserBaseInterface[];
  columns: TaskStatusWithCountInterface[];
} & (
  | {
      mode: 'create';
      initialColumnId: string;
      initialValues?: never;
    }
  | {
      mode: 'edit';
      initialValues: TaskInterface;
      initialColumnId?: never;
    }
);

export default function TaskPopup(props: CreateTaskPopupProps): ReactElement {
  const {
    isOpen,
    onClose,
    members,
    initialColumnId,
    columns,
    initialValues,
    mode,
  } = props;

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogFooter>
        {mode === 'create' ? (
          <TaskForm
            mode={mode}
            members={members}
            columns={columns}
            initialColumnId={initialColumnId}
            onClose={onClose}
          />
        ) : (
          <TaskForm
            mode={mode}
            members={members}
            columns={columns}
            initialValues={initialValues}
            onClose={onClose}
          />
        )}
      </DialogFooter>
    </Dialog>
  );
}
