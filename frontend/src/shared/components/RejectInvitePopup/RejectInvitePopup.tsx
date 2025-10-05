'use client';

import { ReactElement } from 'react';
import styles from './RejectInvitePopup.module.scss';
import Button from '../Button/Button';
import { useRejectInviteMutation } from '../../../api/participationsApi';
import { useToast } from '../../../hooks/useToast';
import { useRouter } from 'next/navigation';

interface RejectInvitePopupProps {
  projectName: string;
  inviteId: string;
  onClose: () => void;
}

export default function RejectInvitePopup(
  props: RejectInvitePopupProps,
): ReactElement {
  const { projectName, inviteId, onClose } = props;
  const [rejectInvite] = useRejectInviteMutation();
  const { showToast, isActive } = useToast();
  const router = useRouter();

  const onSubmit = async (): Promise<void> => {
    if (isActive('invite')) {
      return;
    }

    const result = await rejectInvite(inviteId);
    onClose();

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: `Запрошення до проєкту [${projectName}] відхилено.`,
        life: 3000,
        actionKey: 'invite',
      });
      router.push('/');
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
            Ти дійсно хочеш відмовитись від участі в проєкті? Дію неможливо
            скасувати.
          </p>
        </div>
        <div className={styles['reject-invite-popup__actions']}>
          <Button color="green" variant="secondary-frame" onClick={onClose}>
            Скасувати
          </Button>
          <Button color="green" onClick={onSubmit}>
            Відхилити
          </Button>
        </div>
      </div>
    </div>
  );
}
