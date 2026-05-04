'use client';

import { ReactElement } from 'react';
import Button from '@/shared/components/Button/Button';
import { useTranslations } from 'next-intl';
import Dialog from '@/shared/components/Dialog/Dialog';
import DialogHeader from '@/shared/components/Dialog/DialogHeader/DialogHeader';
import DialogBody from '@/shared/components/Dialog/DialogBody/DialogBody';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';

interface CancelCreateProjectPopupProps {
  onCancel: () => void;
  onConfirm: () => void;
  isOpen: boolean;
}

export default function CancelCreateProjectPopup(
  props: CancelCreateProjectPopupProps,
): ReactElement {
  const { onCancel, onConfirm, isOpen } = props;
  const tButtons = useTranslations('buttons');
  const tPopup = useTranslations('cancelCreateProjectPopup');

  return (
    <Dialog isOpen={isOpen} onClose={onCancel}>
      <DialogHeader title={tPopup('title')} />
      <DialogBody>{tPopup('description')}</DialogBody>
      <DialogFooter>
        <Button color="green" variant="secondary-frame" onClick={onCancel}>
          {tButtons('cancel')}
        </Button>
        <Button color="green" onClick={onConfirm}>
          {tButtons('confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
