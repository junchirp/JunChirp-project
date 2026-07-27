'use client';

import { ReactElement } from 'react';
import Dialog from '@/shared/components/Dialog/Dialog';
import DialogHeader from '@/shared/components/Dialog/DialogHeader/DialogHeader';
import DialogBody from '@/shared/components/Dialog/DialogBody/DialogBody';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';
import Button from '@/shared/components/Button/Button';
import { useTranslations } from 'next-intl';

interface DeleteProjectLogoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteProjectLogoPopup(
  props: DeleteProjectLogoPopupProps,
): ReactElement {
  const { isOpen, onClose, onConfirm } = props;
  const tPopup = useTranslations('deleteProjectLogoPopup');
  const tButtons = useTranslations('buttons');

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader title={tPopup('title')} />
      <DialogBody>{tPopup('description')}</DialogBody>
      <DialogFooter>
        <Button color="green" variant="secondary-frame" onClick={onClose}>
          {tButtons('cancel')}
        </Button>
        <Button color="green" onClick={onConfirm}>
          {tButtons('delete')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
