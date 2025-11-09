'use client';

import { ReactElement } from 'react';
import styles from './RejectInvitePopup.module.scss';
import Button from '@/shared/components/Button/Button';
import { useRejectInviteMutation } from '@/api/participationsApi';
import { useToast } from '@/hooks/useToast';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import { ProjectParticipationInterface } from '../../interfaces/project-participation.interface';

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

  const onSubmit = async (): Promise<void> => {
    if (isActive('invite')) {
      return;
    }

    const result = await rejectInvite({ id: invite.id, userId: user.id });
    onClose();

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: `Запрошення до проєкту [${invite.projectRole.project.projectName}] відхилено.`,
        life: 3000,
        actionKey: 'invite',
      });
    } else {
      showToast({
        severity: 'error',
        summary: 'Не вдалося відхилити запрошення.',
        life: 3000,
        actionKey: 'invite',
      });
    }
  };

  return (
    <div className={styles['reject-invite-popup__wrapper']}>
      <div className={styles['reject-invite-popup']}>
        <div className={styles['reject-invite-popup__content']}>
          <h3 className={styles['reject-invite-popup__title']}>
            Відхилити запрошення в проєкт?
          </h3>
          <p className={styles['reject-invite-popup__text']}>
            Ти дійсно хочеш відхилити запрошення до проєкту{' '}
            <span className={styles['reject-invite-popup__text--green']}>
              [{invite.projectRole.project.projectName}]
            </span>
            ? Дію неможливо скасувати.
          </p>
        </div>
        <div className={styles['reject-invite-popup__actions']}>
          <Button color="green" variant="secondary-frame" onClick={onClose}>
            Скасувати
          </Button>
          <Button
            color="green"
            type="submit"
            onClick={onSubmit}
            loading={isLoading}
          >
            Відхилити
          </Button>
        </div>
      </div>
    </div>
  );
}
