'use client';

import { ReactElement } from 'react';
import styles from './CancelRequestPopup.module.scss';
import Button from '@/shared/components/Button/Button';
import { useCancelRequestMutation } from '@/api/participationsApi';
import { useToast } from '@/hooks/useToast';
import { ProjectParticipationInterface } from '../../interfaces/project-participation.interface';
import { AuthInterface } from '../../interfaces/auth.interface';

interface CancelRequestPopupProps {
  request: ProjectParticipationInterface;
  onClose: () => void;
  user: AuthInterface;
}

export default function CancelRequestPopup(
  props: CancelRequestPopupProps,
): ReactElement {
  const { request, onClose, user } = props;
  const [cancelRequest, { isLoading }] = useCancelRequestMutation();
  const { showToast, isActive } = useToast();

  const onSubmit = async (): Promise<void> => {
    if (isActive('request')) {
      return;
    }

    const result = await cancelRequest({ id: request.id, userId: user.id });
    onClose();

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: 'Заявку скасовано.',
        life: 3000,
        actionKey: 'request',
      });
    } else {
      showToast({
        severity: 'error',
        summary: 'Не вдалося скасувати заявку. Спробуй пізніше.',
        life: 3000,
        actionKey: 'request',
      });
    }
  };

  return (
    <div className={styles['cancel-request-popup__wrapper']}>
      <div className={styles['cancel-request-popup']}>
        <div className={styles['cancel-request-popup__content']}>
          <h3 className={styles['cancel-request-popup__title']}>
            Скасувати заявку?
          </h3>
          <p className={styles['cancel-request-popup__text']}>
            Ти дійсно хочеш скасувати заявку на проєкт{' '}
            <span className={styles['cancel-request-popup__text--green']}>
              [{request.projectRole.project.projectName}]
            </span>
            ? Дію неможливо скасувати.
          </p>
        </div>
        <div className={styles['cancel-request-popup__actions']}>
          <Button color="green" variant="secondary-frame" onClick={onClose}>
            Відмінити
          </Button>
          <Button
            color="green"
            type="submit"
            onClick={onSubmit}
            loading={isLoading}
          >
            Скасувати заявку
          </Button>
        </div>
      </div>
    </div>
  );
}
