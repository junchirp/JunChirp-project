'use client';

import { ReactElement } from 'react';
import styles from './DeleteColumnPopup.module.scss';
import Dialog from '@/shared/components/Dialog/Dialog';
import DialogHeader from '@/shared/components/Dialog/DialogHeader/DialogHeader';
import DialogBody from '@/shared/components/Dialog/DialogBody/DialogBody';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';
import Button from '@/shared/components/Button/Button';
import { useTranslations } from 'next-intl';
import { TaskStatusInterface } from '@/shared/interfaces/task-status.interface';

interface DeleteColumnPopupProps {
  column: TaskStatusInterface;
  onClose: () => void;
  isOpen: boolean;
  onConfirm: () => void;
  loading: boolean;
}

export default function DeleteColumnPopup(
  props: DeleteColumnPopupProps,
): ReactElement {
  const { column, isOpen, loading, onConfirm, onClose } = props;
  const tPopup = useTranslations('deleteColumnPopup');
  const tButtons = useTranslations('buttons');

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader title={tPopup('title')} />
      <DialogBody>
        {tPopup.rich('description', {
          column: (chunks) => (
            <span className={styles['delete-column-popup__text--green']}>
              [{chunks}]
            </span>
          ),
          columnName: column.statusName,
        })}
      </DialogBody>
      <DialogFooter>
        <Button color="green" variant="secondary-frame" onClick={onClose}>
          {tButtons('cancel')}
        </Button>
        <Button color="green" onClick={onConfirm} loading={loading}>
          {tButtons('delete')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
