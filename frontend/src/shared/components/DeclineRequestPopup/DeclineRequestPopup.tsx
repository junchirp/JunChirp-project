'use client';

import { ReactElement } from 'react';
import styles from './DeclineRequestPopup.module.scss';
import Button from '@/shared/components/Button/Button';
import { useTranslations } from 'next-intl';
import DialogHeader from '@/shared/components/Dialog/DialogHeader/DialogHeader';
import DialogBody from '@/shared/components/Dialog/DialogBody/DialogBody';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';
import Dialog from '@/shared/components/Dialog/Dialog';

interface DeclineRequestPopupProps {
  data: DeclineRequestDataInterface;
  onClose: () => void;
  isOpen: boolean;
  onConfirm: (requestId: string, userId: string, projectId: string) => void;
  loading: boolean;
}

export default function DeclineRequestPopup(
  props: DeclineRequestPopupProps,
): ReactElement {
  const { data, onClose, isOpen, onConfirm, loading } = props;
  const t = useTranslations('declineRequestPopup');

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader title={t('title')} />
      <DialogBody>
        {t.rich('description', {
          project: (chunks) => (
            <span className={styles['decline-request-popup__text--green']}>
              [{chunks}]
            </span>
          ),
          user: (chunks) => (
            <span className={styles['decline-request-popup__text--green']}>
              [{chunks}]
            </span>
          ),
          projectName: data.projectName,
          userName: data.userName,
        })}
      </DialogBody>
      <DialogFooter>
        <Button color="green" variant="secondary-frame" onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button
          color="green"
          onClick={() => onConfirm(data.id, data.userId, data.projectId)}
          loading={loading}
        >
          {t('decline')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
