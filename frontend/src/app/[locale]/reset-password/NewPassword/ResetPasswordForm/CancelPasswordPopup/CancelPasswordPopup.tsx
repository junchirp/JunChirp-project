'use client';

import { ReactElement } from 'react';
import Button from '@/shared/components/Button/Button';
import { useTranslations } from 'next-intl';
import Dialog from '@/shared/components/Dialog/Dialog';
import DialogHeader from '@/shared/components/Dialog/DialogHeader/DialogHeader';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';

interface CancelPasswordPopupProps {
  onCancel: () => void;
  onConfirm: () => void;
  isOpen: boolean;
}

export default function CancelPasswordPopup(
  props: CancelPasswordPopupProps,
): ReactElement {
  const { onCancel, onConfirm, isOpen } = props;
  const t = useTranslations('cancelPasswordPopup');

  return (
    <Dialog isOpen={isOpen} onClose={onCancel}>
      <DialogHeader title={t('title')} />
      <DialogFooter>
        <Button color="green" variant="secondary-frame" onClick={onCancel}>
          {t('noBtn')}
        </Button>
        <Button color="green" onClick={onConfirm}>
          {t('yesBtn')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
