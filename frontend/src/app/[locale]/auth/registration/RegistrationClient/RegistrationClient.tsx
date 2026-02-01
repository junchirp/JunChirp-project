'use client';

import RegistrationForm from './RegistrationForm/RegistrationForm';
import styles from './RegistrationClient.module.scss';
import { ReactElement } from 'react';
import SocialButton from '@/shared/components/SocialButton/SocialButton';
import { useTranslations } from 'next-intl';

export default function RegistrationClient(): ReactElement {
  const t = useTranslations('auth');

  return (
    <div className={styles['registration-client']}>
      <RegistrationForm />
      <div className={styles['registration-client__divider']}>
        <div className={styles['registration-client__line']}></div>
        <span className={styles['registration-client__text']}>{t('or')}</span>
        <div className={styles['registration-client__line']}></div>
      </div>
      <SocialButton
        social="google"
        fullWidth={true}
        message={{
          severity: 'error',
          summary: t('googleSignUpError'),
          detail: t('googleSignUpErrorDetails'),
          life: 3000,
          actionKey: 'google',
        }}
      />
    </div>
  );
}
