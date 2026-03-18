'use client';

import { ReactElement } from 'react';
import styles from './CancelPasswordPopup.module.scss';
import Button from '@/shared/components/Button/Button';
import { useTranslations } from 'next-intl';

interface CancelPasswordPopupProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function CancelPasswordPopup({
  onCancel,
  onConfirm,
}: CancelPasswordPopupProps): ReactElement {
  const t = useTranslations('cancelPasswordPopup');

  return (
    <div className={styles['cancel-password-popup__wrapper']}>
      <div className={styles['cancel-password-popup']}>
        <h3 className={styles['cancel-password-popup__title']}>{t('title')}</h3>
        <div className={styles['cancel-password-popup__buttons']}>
          <Button color="red" variant="secondary-frame" onClick={onCancel}>
            {t('noBtn')}
          </Button>
          <Button color="green" onClick={onConfirm}>
            {t('yesBtn')}
          </Button>
        </div>
      </div>
    </div>
  );
}
