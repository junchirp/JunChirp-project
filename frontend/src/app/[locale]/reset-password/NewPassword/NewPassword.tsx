'use client';

import { ReactElement } from 'react';
import styles from './NewPassword.module.scss';
import ResetPasswordForm from './ResetPasswordForm/ResetPasswordForm';
import { RecoveryPasswordInterface } from '@/shared/interfaces/recovery-password.interface';
import { useTranslations } from 'next-intl';

interface NewPasswordProps {
  recoveryData: RecoveryPasswordInterface;
}

export default function NewPassword({
  recoveryData,
}: NewPasswordProps): ReactElement {
  const t = useTranslations('resetPassword.newPassword');

  return (
    <div className={styles['new-password']}>
      <div className={styles['new-password__inner']}>
        <h2 className={styles['new-password__title']}>{t('title')}</h2>
        <ResetPasswordForm recoveryData={recoveryData} />
      </div>
    </div>
  );
}
