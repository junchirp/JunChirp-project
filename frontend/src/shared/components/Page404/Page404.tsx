'use client';

import { ReactElement } from 'react';
import styles from './Page404.module.scss';
import Button from '@/shared/components/Button/Button';
import ArrowUpRight from '@/assets/icons/arrow-up-right.svg';
import { useRouter } from 'next/navigation';
import { useSupport } from '@/hooks/useSupport';
import { useTranslations } from 'next-intl';

export default function Page404(): ReactElement {
  const router = useRouter();
  const support = useSupport();
  const t = useTranslations('page404');

  const goHome = (): void => {
    router.push('/');
  };

  return (
    <div className={styles['page-404']}>
      <div className={styles['page-404__inner']}>
        <div className={styles['page-404__content']}>
          <h2 className={styles['page-404__header']}>{t('title')}</h2>
          <p className={styles['page-404__text']}>{t('description')}</p>
          <Button
            className={styles['page-404__support']}
            variant="link"
            color="green"
            onClick={support}
          >
            {t('support')}
          </Button>
          <Button
            className={styles['page-404__home']}
            color="green"
            iconPosition="right"
            icon={<ArrowUpRight />}
            onClick={goHome}
          >
            {t('home')}
          </Button>
        </div>
      </div>
    </div>
  );
}
