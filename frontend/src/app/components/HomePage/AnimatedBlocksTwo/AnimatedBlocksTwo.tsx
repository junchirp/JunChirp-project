'use client';

import { ReactElement, useEffect, useRef, useState } from 'react';
import styles from './AnimatedBlocksTwo.module.scss';

export default function AnimatedBlocksTwo(): ReactElement {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);

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
      <h2 className={styles['three-steps__header']}>
        Три прості кроки до впевненого IT-Профі:
      </h2>
      <div className={styles['three-steps__steps']} ref={containerRef}>
        <div
          className={`${styles['three-steps__one']} ${visible ? styles['three-steps__show'] : ''}`}
        >
          <div
            className={`${styles['three-steps__step-box']} ${styles['three-steps__step-box--one-top']}`}
          >
            <h3 className={styles['three-steps__step-title']}>
              Заповни профіль.
            </h3>
            <p className={styles['three-steps__step-text']}>
              Розкажи про себе та свої навички &mdash; це твій стартовий
              майданчик.
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
              Приєднуйся до проєкту.
            </h3>
          </div>
          <div
            className={`${styles['three-steps__step-box']} ${styles['three-steps__step-box--two-bottom']}`}
          >
            <p className={styles['three-steps__step-text']}>
              Знайди команду, в якій твої ідеї матимуть значення. Отримай
              реальний досвід і підтримку!
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
              Запусти свій проєкт.
            </h3>
            <p className={styles['three-steps__step-text']}>
              Візьми на себе роль лідера — керуй командою та втілюй ідеї в
              реальність.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
