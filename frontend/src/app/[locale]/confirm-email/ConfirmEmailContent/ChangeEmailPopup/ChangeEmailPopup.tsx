'use client';

import { ReactElement } from 'react';
import styles from './ChangeEmailPopup.module.scss';
import ChangeEmailForm from './ChangeEmailForm/ChangeEmailForm';
import { useTranslations } from 'next-intl';

interface ConfirmModalProps {
  onClose: () => void;
}

export default function ChangeEmailPopup(
  props: ConfirmModalProps,
): ReactElement {
  const { onClose } = props;
  const t = useTranslations('changeEmailPopup');

  return (
    <div className={styles['change-email-popup__wrapper']}>
      <div className={styles['change-email-popup']}>
        <div className={styles['change-email-popup__content']}>
          <h3 className={styles['change-email-popup__title']}>{t('title')}</h3>
          <p className={styles['change-email-popup__text']}>
            {t('description')}
          </p>
        </div>
        <ChangeEmailForm onClose={onClose} />
      </div>
    </div>
  );
}
