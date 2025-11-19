'use client';

import React, { ReactElement } from 'react';
import styles from './WhatAwaits.module.scss';
import Image from 'next/image';
import Button from '@/shared/components/Button/Button';
import Linkedin from '@/assets/icons/linkedin.svg';
import { useTranslations } from 'next-intl';

export default function WhatAwaits(): ReactElement {
  const t = useTranslations('about.whatAwaits');

  const goLinkedin = (): void => {
    window.open('https://www.linkedin.com/company/jun-chirp', '_blank');
  };

  return (
    <div className={styles['what-awaits']}>
      <Image
        className={styles['what-awaits__star-top']}
        src="/images/star.svg"
        alt="star"
        width={33}
        height={35}
      />
      <Image
        className={styles['what-awaits__star-bottom']}
        src="/images/star.svg"
        alt="star"
        width={33}
        height={35}
      />
      <div className={styles['what-awaits__content']}>
        <h2 className={styles['what-awaits__header']}>{t('title')}</h2>
        <ul className={styles['what-awaits__list']}>
          <li className={styles['what-awaits__list-item']}>{t('itemFirst')}</li>
          <li className={styles['what-awaits__list-item']}>
            {t('itemSecond')}
          </li>
          <li className={styles['what-awaits__list-item']}>{t('itemThird')}</li>
        </ul>
        <div className={styles['what-awaits__footer']}>
          <Button
            color="green"
            variant="secondary-frame"
            icon={<Linkedin />}
            onClick={goLinkedin}
          />
          <p className={styles['what-awaits__footer-text']}>{t('follow')}</p>
        </div>
      </div>
    </div>
  );
}
