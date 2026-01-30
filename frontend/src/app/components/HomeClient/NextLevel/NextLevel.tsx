'use client';

import React, { ReactElement } from 'react';
import styles from './NextLevel.module.scss';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function NextLevel(): ReactElement {
  const t = useTranslations('nextLevel');
  const tAnimation: { title: string; description: string }[] =
    t.raw('animation');

  return (
    <div className={styles['next-level']}>
      <h2 className={styles['next-level__header']}>{t('title')}</h2>
      <div className={styles['next-level__inner']}>
        <div className={styles['next-level__content']}>
          <div className={styles['next-level__new-opportunities']}>
            {t.rich('description', {
              span: (chunks) => (
                <span className={styles['next-level__green-text']}>
                  {chunks}
                </span>
              ),
            })}
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
                {tAnimation[0].title}
              </h3>
              <p className={styles['next-level__text']}>
                {tAnimation[0].description}
              </p>
            </div>
            <div className={styles['next-level__grow-playing']}>
              <h3 className={styles['next-level__title']}>
                {tAnimation[1].title}
              </h3>
              <p className={styles['next-level__text']}>
                {tAnimation[1].description}
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
