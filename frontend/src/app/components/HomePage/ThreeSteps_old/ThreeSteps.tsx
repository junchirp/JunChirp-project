'use client';

import { ReactElement, useEffect, useRef, useState } from 'react';
import styles from './ThreeSteps.module.scss';

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export default function ThreeSteps(): ReactElement {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [pinDuration, setPinDuration] = useState(0);
  const [wrapperHeight, setWrapperHeight] = useState<number | undefined>(
    undefined,
  );
  const [progress, setProgress] = useState(0);

  const STICKY_TOP = 130;

  useEffect(() => {
    const measure = (): void => {
      const pin = window.innerHeight;
      setPinDuration(pin);

      const containerH = stickyRef.current?.offsetHeight ?? 0;
      setWrapperHeight(containerH + pin);
    };

    measure();
    window.addEventListener('resize', measure);
    return (): void => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    const onScroll = (): void => {
      if (!wrapperRef.current) {
        return;
      }
      const rect = wrapperRef.current.getBoundingClientRect();

      const offset = STICKY_TOP - rect.top;
      const p = clamp(offset / pinDuration, 0, 1);
      setProgress(p);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return (): void => window.removeEventListener('scroll', onScroll);
  }, [pinDuration]);

  const opacity1 = clamp(progress / 0.3333, 0, 1);
  const opacity2 = clamp((progress - 0.3333) / 0.3333, 0, 1);
  const opacity3 = clamp((progress - 0.6667) / 0.3333, 0, 1);

  return (
    <div
      ref={wrapperRef}
      className={styles['three-steps__wrapper']}
      style={{
        height: wrapperHeight ?? 0,
      }}
    >
      <div
        ref={stickyRef}
        className={styles['three-steps']}
        style={{
          top: STICKY_TOP,
        }}
      >
        <h2 className={styles['three-steps__header']}>
          Три прості кроки до впевненого IT-Профі:
        </h2>
        <div className={styles['three-steps__steps']}>
          <div
            className={styles['three-steps__one']}
            style={{
              opacity: opacity1,
            }}
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
            className={styles['three-steps__two']}
            style={{
              opacity: opacity2,
            }}
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
            className={styles['three-steps__three']}
            style={{
              opacity: opacity3,
            }}
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
    </div>
  );
}
