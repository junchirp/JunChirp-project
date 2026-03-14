import { ReactElement } from 'react';
import styles from './page.module.scss';
import RequestPasswordResetForm from './RequestPasswordResetForm/RequestPasswordResetForm';
import { getTranslations } from 'next-intl/server';

export default async function RequestPasswordReset(): Promise<ReactElement> {
  const t = await getTranslations('requestPasswordReset');

  return (
    <div className={styles['request-password-reset']}>
      <div className={styles['request-password-reset__content']}>
        <h2 className={styles['request-password-reset__title']}>
          {t('title')}
        </h2>
        <p className={styles['request-password-reset__text']}>
          {t('description')}
        </p>
        <RequestPasswordResetForm />
      </div>
    </div>
  );
}
