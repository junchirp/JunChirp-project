'use client';

import { ReactElement } from 'react';
import authSelector from '@/redux/auth/authSelector';
import SupportForm from '@/shared/components/SupportPopup/SupportForm/SupportForm';
import { useAppSelector } from '@/hooks/reduxHooks';
import { useTranslations } from 'next-intl';
import Dialog from '@/shared/components/Dialog/Dialog';
import DialogHeader from '@/shared/components/Dialog/DialogHeader/DialogHeader';
import DialogBody from '@/shared/components/Dialog/DialogBody/DialogBody';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';

interface SupportPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportPopup(props: SupportPopupProps): ReactElement {
  const { isOpen, onClose } = props;
  const user = useAppSelector(authSelector.selectUser);
  const t = useTranslations('support');

  return (
    <Dialog isOpen={isOpen} showCloseButton onClose={onClose}>
      <DialogHeader title={t('title')} />
      <DialogBody>{t('description')}</DialogBody>
      <DialogFooter>
        <SupportForm user={user} onClose={onClose}></SupportForm>
      </DialogFooter>
    </Dialog>
  );
}
