'use client';

import styles from './LoginClient.module.scss';
import LoginForm from './LoginForm/LoginForm';
import { ReactElement } from 'react';
import SocialButton from '@/shared/components/SocialButton/SocialButton';
import { useTranslations } from 'next-intl';

export default function LoginClient(): ReactElement {
  const t = useTranslations('auth');

  return (
    <div className={styles['login-client']}>
      <LoginForm />
      <div className={styles['login-client__divider']}>
        <div className={styles['login-client__line']}></div>
        <span className={styles['login-client__text']}>{t('or')}</span>
        <div className={styles['login-client__line']}></div>
      </div>
      <SocialButton
        social="google"
        fullWidth={true}
        message={{
          severity: 'error',
          summary: t('googleSignInError'),
          detail: t('googleSignInErrorDetails'),
          life: 3000,
          actionKey: 'google',
        }}
      />
    </div>
  );
}
