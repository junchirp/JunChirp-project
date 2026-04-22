'use client';

import { ReactElement } from 'react';
import ChangeEmailForm from './ChangeEmailForm/ChangeEmailForm';
import { useTranslations } from 'next-intl';
import Dialog from '@/shared/components/Dialog/Dialog';
import DialogHeader from '@/shared/components/Dialog/DialogHeader/DialogHeader';
import DialogBody from '@/shared/components/Dialog/DialogBody/DialogBody';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';

interface ConfirmModalProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function ChangeEmailPopup(
  props: ConfirmModalProps,
): ReactElement {
  const { onClose, isOpen } = props;
  const t = useTranslations('changeEmailPopup');

  return (
    <Dialog isOpen={isOpen} showCloseButton onClose={onClose}>
      <DialogHeader title={t('title')} />
      <DialogBody>{t('description')}</DialogBody>
      <DialogFooter>
        <ChangeEmailForm onClose={onClose} />
      </DialogFooter>
    </Dialog>
  );
}
