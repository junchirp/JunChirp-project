'use client';

import { ReactElement } from 'react';
import styles from './RejectInvitePopup.module.scss';
import Button from '@/shared/components/Button/Button';
import { useRejectInviteMutation } from '@/api/participationsApi';
import { useToast } from '@/hooks/useToast';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import { ProjectParticipationInterface } from '../../interfaces/project-participation.interface';
import { useTranslations } from 'next-intl';

interface RejectInvitePopupProps {
  invite: ProjectParticipationInterface;
  onClose: () => void;
  user: AuthInterface;
}

export default function RejectInvitePopup(
  props: RejectInvitePopupProps,
): ReactElement {
  const { invite, onClose, user } = props;
  const [rejectInvite, { isLoading }] = useRejectInviteMutation();
  const { showToast, isActive } = useToast();
  const t = useTranslations('rejectInvitePopup');

  const onSubmit = async (): Promise<void> => {
    if (isActive('invite')) {
      return;
    }

    const result = await rejectInvite({ id: invite.id, userId: user.id });
    onClose();

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: `${t('success')}`,
        life: 3000,
        actionKey: 'invite',
      });
    } else {
      showToast({
        severity: 'error',
        summary: `${t('error')}`,
        life: 3000,
        actionKey: 'invite',
      });
    }
  };

  return (
    <div className={styles['reject-invite-popup__wrapper']}>
      <div className={styles['reject-invite-popup']}>
        <div className={styles['reject-invite-popup__content']}>
          <h3 className={styles['reject-invite-popup__title']}>{t('title')}</h3>
          <p className={styles['reject-invite-popup__text']}>
            {t('firstPart')}
            <span className={styles['reject-invite-popup__text--green']}>
              [{invite.projectRole.project.projectName}]
            </span>
            {t('secondPart')}
          </p>
        </div>
        <div className={styles['reject-invite-popup__actions']}>
          <Button color="green" variant="secondary-frame" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button
            color="green"
            type="submit"
            onClick={onSubmit}
            loading={isLoading}
          >
            {t('decline')}
          </Button>
        </div>
      </div>
    </div>
  );
}
