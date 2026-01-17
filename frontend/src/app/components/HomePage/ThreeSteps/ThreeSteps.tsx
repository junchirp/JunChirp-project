'use client';

import { ReactElement, useEffect, useRef, useState } from 'react';
import styles from './ThreeSteps.module.scss';
import { useTranslations } from 'next-intl';

export default function ThreeSteps(): ReactElement {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const t = useTranslations('threeSteps');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio === 1) {
          setVisible(true);
        } else if (entry.intersectionRatio === 0) {
          setVisible(false);
        }
      },
      {
        threshold: [0, 1],
      },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return (): void => observer.disconnect();
  }, []);

  return (
    <div className={styles['three-steps']}>
      <h2 className={styles['three-steps__header']}>{t('title')}</h2>
      <div className={styles['three-steps__steps']} ref={containerRef}>
        <div
          className={`${styles['three-steps__one']} ${visible ? styles['three-steps__show'] : ''}`}
        >
          <div
            className={`${styles['three-steps__step-box']} ${styles['three-steps__step-box--one-top']}`}
          >
            <h3 className={styles['three-steps__step-title']}>
              {t('stepOne.title')}
            </h3>
            <p className={styles['three-steps__step-text']}>
              {t('stepOne.description')}
            </p>
          </div>
          <div
            className={`${styles['three-steps__step-box']} ${styles['three-steps__step-box--one-bottom']}`}
          >
            <p className={styles['three-steps__step-number']}>1</p>
          </div>
        </div>
        <div
          className={`${styles['three-steps__two']} ${visible ? styles['three-steps__show'] : ''}`}
        >
          <div
            className={`${styles['three-steps__step-box']} ${styles['three-steps__step-box--two-top']}`}
          >
            <p className={styles['three-steps__step-number']}>2</p>
            <h3 className={styles['three-steps__step-title']}>
              {t('stepTwo.title')}
            </h3>
          </div>
          <div
            className={`${styles['three-steps__step-box']} ${styles['three-steps__step-box--two-bottom']}`}
          >
            <p className={styles['three-steps__step-text']}>
              {t('stepTwo.description')}
            </p>
          </div>
        </div>
        <div
          className={`${styles['three-steps__three']} ${visible ? styles['three-steps__show'] : ''}`}
        >
          <div
            className={`${styles['three-steps__step-box']} ${styles['three-steps__step-box--three-top']}`}
          >
            <p className={styles['three-steps__step-number']}>3</p>
          </div>
          <div className={styles['three-steps__step-box']}>
            <h3 className={styles['three-steps__step-title']}>
              {t('stepThree.title')}
            </h3>
            <p className={styles['three-steps__step-text']}>
              {t('stepThree.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
