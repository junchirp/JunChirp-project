'use client';

import { ReactElement } from 'react';
import styles from './NextLevel.module.scss';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function NextLevel(): ReactElement {
  const t = useTranslations('nextLevel');

  return (
    <div className={styles['next-level']}>
      <h2 className={styles['next-level__header']}>{t('title')}</h2>
      <div className={styles['next-level__inner']}>
        <div className={styles['next-level__content']}>
          <div className={styles['next-level__new-opportunities']}>
            {t('descriptionLeft')}
            <span className={styles['next-level__green-text']}>
              {t('comingSoon')}
            </span>
          </div>
          <div className={styles['next-level__arrow']}>
            <Image
              src="/images/arrow-right.svg"
              alt="arrow"
              height={160}
              width={160}
            />
          </div>
          <div className={styles['next-level__right-block']}>
            <div className={styles['next-level__dashboard']}>
              <h3 className={styles['next-level__title']}>
                {t('titleRightOne')}
              </h3>
              <p className={styles['next-level__text']}>
                {t('descriptionRightOne')}
              </p>
            </div>
            <div className={styles['next-level__grow-playing']}>
              <h3 className={styles['next-level__title']}>
                {t('titleRightTwo')}
              </h3>
              <p className={styles['next-level__text']}>
                {t('descriptionRightTwo')}
              </p>
            </div>
          </div>
        </div>
        <div className={styles['next-level__slider']}>
          <div className={styles['next-level__slider-item-1']}></div>
          <div className={styles['next-level__slider-item-2']}></div>
        </div>
      </div>
    </div>
  );
}
