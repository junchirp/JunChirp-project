'use client';

import { ReactElement } from 'react';
import Dialog from '@/shared/components/Dialog/Dialog';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';
import { UserBaseInterface } from '@/shared/interfaces/user-base.interface';
import { TaskStatusWithCountInterface } from '@/shared/interfaces/task-status-with-count.interface';
import TaskForm from '@/shared/components/TaskForm/TaskForm';

interface CreateTaskPopupProps {
  isOpen: boolean;
  onClose: () => void;
  members: UserBaseInterface[];
  columns: TaskStatusWithCountInterface[];
  initialColumnId: string;
}

export default function CreateTaskPopup(
  props: CreateTaskPopupProps,
): ReactElement {
  const { isOpen, onClose, members, initialColumnId, columns } = props;

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogFooter>
        <TaskForm
          members={members}
          columns={columns}
          initialColumnId={initialColumnId}
          onClose={onClose}
        />
      </DialogFooter>
    </Dialog>
  );
}
