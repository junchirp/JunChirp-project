'use client';

import { ReactElement } from 'react';
import styles from './RejectRequestPopup.module.scss';
import Button from '@/shared/components/Button/Button';
import { useRejectRequestMutation } from '@/api/participationsApi';
import { useToast } from '@/hooks/useToast';
import { UserInterface } from '@/shared/interfaces/user.interface';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('rejectRequestPopup');

  const onSubmit = async (): Promise<void> => {
    if (isActive('request')) {
      return;
    }

    const result = await rejectRequest({ id: request.id, userId: user.id });
    onClose();

    if ('data' in result) {
      showToast({
        severity: 'success',
        summary: t('success'),
        life: 3000,
        actionKey: 'request',
      });
    } else {
      showToast({
        severity: 'error',
        summary: t('error'),
        detail: t('errorDetails'),
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
            {t('title')}
          </h3>
          <p className={styles['reject-request-popup__text']}>
            {t('firstPart')}
            <span className={styles['reject-request-popup__text--green']}>
              [{user.firstName} {user.lastName}]
            </span>
            {t('secondPart')}
            <span className={styles['reject-request-popup__text--green']}>
              [{request.projectRole.project.projectName}]
            </span>
          </p>
        </div>
        <div className={styles['reject-request-popup__actions']}>
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
