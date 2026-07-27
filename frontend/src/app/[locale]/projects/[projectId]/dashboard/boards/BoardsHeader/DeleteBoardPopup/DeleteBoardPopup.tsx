'use client';

import { ReactElement } from 'react';
import styles from './DeleteBoardPopup.module.scss';
import Dialog from '@/shared/components/Dialog/Dialog';
import { BoardInterface } from '@/shared/interfaces/board.interface';
import DialogHeader from '@/shared/components/Dialog/DialogHeader/DialogHeader';
import DialogBody from '@/shared/components/Dialog/DialogBody/DialogBody';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';
import Button from '@/shared/components/Button/Button';
import { useTranslations } from 'next-intl';

interface DeleteBoardPopupProps {
  board: BoardInterface;
  onClose: () => void;
  isOpen: boolean;
  onConfirm: () => void;
  loading: boolean;
}

export default function DeleteBoardPopup(
  props: DeleteBoardPopupProps,
): ReactElement {
  const { board, isOpen, loading, onConfirm, onClose } = props;
  const tPopup = useTranslations('deleteBoardPopup');
  const tButtons = useTranslations('buttons');

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader title={tPopup('title')} />
      <DialogBody>
        {tPopup.rich('description', {
          board: (chunks) => (
            <span className={styles['delete-board-popup__text--green']}>
              [{chunks}]
            </span>
          ),
          boardName: board.boardName,
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
