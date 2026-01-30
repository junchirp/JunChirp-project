'use client';

import React, { ReactElement } from 'react';
import styles from './PasswordStrengthIndicator.module.scss';
import { useTranslations } from 'next-intl';

type PasswordStrength = 'none' | 'weak' | 'medium' | 'strong';

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
}

export default function PasswordStrengthIndicator({
  strength,
}: PasswordStrengthIndicatorProps): ReactElement {
  const t = useTranslations('passwordIndicator');
  const strengthInfoMap = {
    none: {
      classNames: ['', '', ''],
      text: '',
    },
    weak: {
      classNames: [styles['password-strength__item--weak'], '', ''],
      text: t('weak'),
    },
    medium: {
      classNames: [
        styles['password-strength__item--medium'],
        styles['password-strength__item--medium'],
        '',
      ],
      text: t('medium'),
    },
    strong: {
      classNames: [
        styles['password-strength__item--strong'],
        styles['password-strength__item--strong'],
        styles['password-strength__item--strong'],
      ],
      text: t('strong'),
    },
  };
  const strengthInfo = strengthInfoMap[strength];

  return (
    <div className={styles['password-strength']}>
      <div className={styles['password-strength__list']}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${styles['password-strength__item']} ${strengthInfo.classNames[i] || ''}`}
          ></div>
        ))}
      </div>
      <div className={styles['password-strength__describe']}>
        {strengthInfo.text}
      </div>
    </div>
  );
}
