'use client';

import { ReactElement } from 'react';
import styles from './Quote.module.scss';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Quote(): ReactElement {
  const t = useTranslations('homeQuote');

  return (
    <div className={styles.quote}>
      <div className={styles.quote__inner}>
        <Image
          className={styles['quote__top-star']}
          src="/images/star.svg"
          alt="bird"
          width={33}
          height={35}
        />
        <h2 className={styles.quote__quote}>{t('quote')}</h2>
        <Image
          className={styles['quote__bottom-star']}
          src="/images/star.svg"
          alt="bird"
          width={33}
          height={35}
        />
      </div>
    </div>
  );
}
