import styles from './AuthFormContainer.module.scss';
import { ReactElement } from 'react';
import SocialButton from '@/shared/components/SocialButton/SocialButton';
import { getTranslations } from 'next-intl/server';

interface AuthFormContainerProps {
  children: ReactElement;
}

export default async function AuthFormContainer({
  children,
}: AuthFormContainerProps): Promise<ReactElement> {
  const t = await getTranslations('auth');

  return (
    <div className={styles['auth-form-container']}>
      {children}
      <div className={styles['auth-form-container__divider']}>
        <div className={styles['auth-form-container__line']} />
        <span className={styles['auth-form-container__text']}>{t('or')}</span>
        <div className={styles['auth-form-container__line']} />
      </div>
      <SocialButton social="google" fullWidth={true} />
    </div>
  );
}
