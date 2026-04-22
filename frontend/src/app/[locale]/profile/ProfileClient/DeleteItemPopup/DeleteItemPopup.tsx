'use client';

import { ReactElement } from 'react';
import Button from '@/shared/components/Button/Button';
import { useTranslations } from 'next-intl';
import Dialog from '@/shared/components/Dialog/Dialog';
import DialogHeader from '@/shared/components/Dialog/DialogHeader/DialogHeader';
import DialogBody from '@/shared/components/Dialog/DialogBody/DialogBody';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';

interface DeleteItemPopupProps<T> {
  item: T;
  title: string;
  message: ReactElement<HTMLParagraphElement>;
  onCancel: () => void;
  loading: boolean;
  onConfirm: (item: T) => void;
  isOpen: boolean;
}

export default function DeleteItemPopup<T>(
  props: DeleteItemPopupProps<T>,
): ReactElement {
  const { item, title, message, onCancel, onConfirm, loading, isOpen } = props;
  const t = useTranslations('buttons');

  return (
    <Dialog isOpen={isOpen} onClose={onCancel}>
      <DialogHeader title={title} />
      <DialogBody>{message}</DialogBody>
      <DialogFooter>
        <Button color="green" variant="secondary-frame" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button color="green" loading={loading} onClick={() => onConfirm(item)}>
          {t('delete')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
