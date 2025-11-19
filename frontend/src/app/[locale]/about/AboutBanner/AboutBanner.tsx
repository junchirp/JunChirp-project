'use client';

import { ReactElement } from 'react';
import styles from './AboutBanner.module.scss';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function AboutBanner(): ReactElement {
  const t = useTranslations('about.banner');

  return (
    <div className={styles['about-banner']}>
      <div className={styles['about-banner__inner']}>
        <h2 className={styles['about-banner__title']}>
          {t('title')}
          <span className={styles['about-banner__green-text']}>
            [JunChirp!]
          </span>
        </h2>
        <div className={styles['about-banner__content-wrapper']}>
          <div className={styles['about-banner__content']}>
            <p>{t('descriptionFirst')}</p>
            <p>
              <span className={styles['about-banner__green-text']}>
                {t('ourMission')}
              </span>
              {t('descriptionSecond')}
            </p>
          </div>
          <Image src="/images/bird-4.svg" alt="bird" width={371} height={311} />
        </div>
      </div>
    </div>
  );
}
