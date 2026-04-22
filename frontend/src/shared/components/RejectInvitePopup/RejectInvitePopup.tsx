'use client';

import { ReactElement } from 'react';
import styles from './RejectInvitePopup.module.scss';
import Button from '@/shared/components/Button/Button';
import { useRejectInviteMutation } from '@/api/participationsApi';
import { useToast } from '@/hooks/useToast';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import { useTranslations } from 'next-intl';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import Dialog from '@/shared/components/Dialog/Dialog';
import DialogHeader from '@/shared/components/Dialog/DialogHeader/DialogHeader';
import DialogBody from '@/shared/components/Dialog/DialogBody/DialogBody';
import DialogFooter from '@/shared/components/Dialog/DialogFooter/DialogFooter';

interface RejectInvitePopupProps {
  invite: ProjectParticipationInterface;
  onClose: () => void;
  user: AuthInterface;
  isOpen: boolean;
}

export default function RejectInvitePopup(
  props: RejectInvitePopupProps,
): ReactElement {
  const { invite, onClose, user, isOpen } = props;
  const [rejectInvite, { isLoading }] = useRejectInviteMutation();
  const { showToast, isActive } = useToast();
  const t = useTranslations('rejectInvitePopup');

  const onSubmit = async (): Promise<void> => {
    if (isActive(ToastKeysEnum.PARTICIPATION_INVITE)) {
      return;
    }

    const result = await rejectInvite({ id: invite.id, userId: user.id });
    onClose();

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: t('success'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_INVITE,
      });
    } else {
      showToast({
        severity: 'error',
        summary: t('error'),
        detail: t('errorDetails'),
        life: 3000,
        actionKey: ToastKeysEnum.PARTICIPATION_INVITE,
      });
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader title={t('title')} />
      <DialogBody>
        {t.rich('description', {
          project: (chunks) => (
            <span className={styles['reject-invite-popup__text--green']}>
              [{chunks}]
            </span>
          ),
          projectName: invite.projectRole.project.projectName,
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
