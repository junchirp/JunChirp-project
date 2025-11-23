'use client';

import { ReactElement } from 'react';
import styles from './RejectRequestPopup.module.scss';
import Button from '@/shared/components/Button/Button';
import { useRejectRequestMutation } from '@/api/participationsApi';
import { useToast } from '@/hooks/useToast';
import { UserInterface } from '@/shared/interfaces/user.interface';
import { ProjectParticipationInterface } from '../../interfaces/project-participation.interface';

interface RejectRequestPopupProps {
  request: ProjectParticipationInterface;
  onClose: () => void;
  user: UserInterface;
}

export default function RejectRequestPopup(
  props: RejectRequestPopupProps,
): ReactElement {
  const { request, onClose, user } = props;
  const [rejectRequest, { isLoading }] = useRejectRequestMutation();
  const { showToast, isActive } = useToast();

  const onSubmit = async (): Promise<void> => {
    if (isActive('request')) {
      return;
    }

    const result = await rejectRequest({ id: request.id, userId: user.id });
    onClose();

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: 'Запит на участь в проєкті відхилено.',
        life: 3000,
        actionKey: 'request',
      });
    } else {
      showToast({
        severity: 'error',
        summary: 'Не вдалося відхилити запит на участь в проекті.',
        life: 3000,
        actionKey: 'request',
      });
    }
  };

  return (
    <div className={styles['reject-request-popup__wrapper']}>
      <div className={styles['reject-request-popup']}>
        <div className={styles['reject-request-popup__content']}>
          <h3 className={styles['reject-request-popup__title']}>
            Відхилити запит на участь в проєкті?
          </h3>
          <p className={styles['reject-request-popup__text']}>
            Ти дійсно хочеш відхилити запит на участь в проєкті? Дію неможливо
            скасувати.
          </p>
        </div>
        <div className={styles['reject-request-popup__actions']}>
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
