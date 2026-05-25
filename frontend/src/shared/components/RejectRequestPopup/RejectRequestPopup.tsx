'use client';

import { ReactElement } from 'react';
import styles from './RejectRequestPopup.module.scss';
import Button from '@/shared/components/Button/Button';
import { useRejectRequestMutation } from '@/api/participationsApi';
import { useToast } from '@/hooks/useToast';
import { UserInterface } from '@/shared/interfaces/user.interface';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import { useTranslations } from 'next-intl';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import DialogHeader from '@/shared/components/Dialog/DialogHeader/DialogHeader';
import DialogBody from '@/shared/components/Dialog/DialogBody/DialogBody';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';
import Dialog from '@/shared/components/Dialog/Dialog';

interface RejectRequestPopupProps {
  request: ProjectParticipationInterface;
  onClose: () => void;
  user: UserInterface;
  isOpen: boolean;
}

export default function RejectRequestPopup(
  props: RejectRequestPopupProps,
): ReactElement {
  const { request, onClose, user, isOpen } = props;
  const [rejectRequest, { isLoading }] = useRejectRequestMutation();
  const { showToast, isActive } = useToast();
  const t = useTranslations('rejectRequestPopup');

  const onSubmit = async (): Promise<void> => {
    if (isActive(ToastKeysEnum.PARTICIPATION_REQUEST)) {
      return;
    }

    try {
      await rejectRequest({ id: request.id, userId: user.id }).unwrap();

      showToast({
        severity: 'success',
        summary: t('success'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_REQUEST,
      });
    } catch {
      showToast({
        severity: 'error',
        summary: t('error'),
        detail: t('errorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_REQUEST,
      });
    } finally {
      onClose();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader title={t('title')} />
      <DialogBody>
        {t.rich('description', {
          project: (chunks) => (
            <span className={styles['reject-request-popup__text--green']}>
              [{chunks}]
            </span>
          ),
          user: (chunks) => (
            <span className={styles['reject-request-popup__text--green']}>
              [{chunks}]
            </span>
          ),
          projectName: request.projectRole.project.projectName,
          userName: `${user.firstName} ${user.lastName}`,
        })}
      </DialogBody>
      <DialogFooter>
        <Button color="green" variant="secondary-frame" onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button color="green" onClick={onSubmit} loading={isLoading}>
          {t('decline')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
