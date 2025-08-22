'use client';

import { ReactElement } from 'react';
import styles from './Page404.module.scss';
import Button from '../Button/Button';
import ArrowUpRight from '@/assets/icons/arrow-up-right.svg';
import { useRouter } from 'next/navigation';
import { useSupport } from '../../../hooks/useSupport';

export default function Page404(): ReactElement {
  const router = useRouter();
  const support = useSupport();

  const goHome = (): void => {
    router.push('/');
  };

  return (
    <div className={styles['page-404']}>
      <div className={styles['page-404__inner']}>
        <div className={styles['page-404__content']}>
          <h2 className={styles['page-404__header']}>Сторінку не знайдено</h2>
          <p className={styles['page-404__text']}>
            Ой, ти потрапив на таємну сторінку, якої не існує! Можливо, сторінка
            була видалена або переміщена. Перейди на нашу головну сторінку, щоб
            знайти потрібну інформацію.
          </p>
          <Button
            className={styles['page-404__support']}
            variant="link"
            color="green"
            onClick={support}
          >
            Повідомити про проблему
          </Button>
          <Button
            className={styles['page-404__home']}
            color="green"
            iconPosition="right"
            icon={<ArrowUpRight />}
            onClick={goHome}
          >
            На головну
          </Button>
        </div>
      </div>
    </div>
  );
}
