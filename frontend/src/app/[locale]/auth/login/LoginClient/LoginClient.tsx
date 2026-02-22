'use client';

import styles from './LoginClient.module.scss';
import LoginForm from './LoginForm/LoginForm';
import { ReactElement, useEffect, useRef } from 'react';
import SocialButton from '@/shared/components/SocialButton/SocialButton';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { useRouter } from '@/i18n/routing';

export default function LoginClient(): ReactElement {
  const t = useTranslations('auth');
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const hasShownToast = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get('error');
    if (!error || hasShownToast.current) {
      return;
    }
    hasShownToast.current = true;
    showToast({
      severity: 'error',
      summary: t('googleError'),
      detail: t('googleErrorDetails'),
      life: 3000,
      actionKey: 'google',
    });
    router.replace(window.location.pathname, { scroll: false });
  }, []);

  return (
    <div className={styles['login-client']}>
      <LoginForm />
      <div className={styles['login-client__divider']}>
        <div className={styles['login-client__line']}></div>
        <span className={styles['login-client__text']}>{t('or')}</span>
        <div className={styles['login-client__line']}></div>
      </div>
      <SocialButton social="google" fullWidth={true} />
    </div>
  );
}
