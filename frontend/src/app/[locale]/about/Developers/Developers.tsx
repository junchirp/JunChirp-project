'use client';

import { ReactElement, useEffect, useRef, useState } from 'react';
import styles from './Developers.module.scss';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useGetDevelopersQuery } from '@/api/developersApi';

const VISIBLE = 3;
const CLONES = (VISIBLE + 1) / 2;
const slideWidth = 308;

export default function Developers(): ReactElement {
  const { data: developers = [] } = useGetDevelopersQuery();
  const [index, setIndex] = useState(CLONES);
  const [transition, setTransition] = useState(true);
  const tDev = useTranslations('about.developers');
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const developersRef = useRef<HTMLDivElement>(null);
  const items = [
    ...developers.slice(-CLONES),
    ...developers,
    ...developers.slice(0, CLONES),
  ];

  const handleTransitionEnd = (): void => {
    if (index >= developers.length + CLONES) {
      setTransition(false);
      setIndex(CLONES);
    }
    if (index < CLONES) {
      setTransition(false);
      setIndex(developers.length + CLONES - 1);
    }
  };

  const next = (): void => {
    setIsAutoplayEnabled(false);
    setIndex((i) => i + 1);
  };

  const prev = (): void => {
    setIsAutoplayEnabled(false);
    setIndex((i) => i - 1);
  };

  useEffect(() => {
    if (!transition) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransition(true);
        });
      });
    }
  }, [transition]);

  useEffect(() => {
    if (!isAutoplayEnabled || !isVisible) {
      return;
    }

    const timer = setInterval(() => {
      setIndex((i) => i + 1);
    }, 10000);

    return (): void => clearInterval(timer);
  }, [isAutoplayEnabled, isVisible]);

  useEffect(() => {
    const element = developersRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsAutoplayEnabled(true);
      }
    });
    observer.observe(element);

    return (): void => observer.disconnect();
  }, []);

  const itemTransitionStyle = transition
    ? { transition: 'all 0.5s ease' }
    : { transition: 'none' };

  return (
    <div className={styles.developers} ref={developersRef}>
      <h2 className={styles.developers__title}>
        {tDev('title')}
        <span className={styles['developers__green-text']}>[JunChirp]</span>
      </h2>
      <div className={styles['developers__carousel-wrapper']}>
        <div className={styles.developers__carousel}>
          <button
            className={`${styles.developers__button} ${styles['developers__button--left']}`}
            onClick={prev}
          >
            <Image
              src="/images/chevrons-left.svg"
              alt="left"
              width={138}
              height={138}
            />
          </button>
          <button
            className={`${styles.developers__button} ${styles['developers__button--right']}`}
            onClick={next}
          >
            <Image
              src="/images/chevrons-right.svg"
              alt="right"
              width={138}
              height={138}
            />
          </button>
          <div
            className={styles['developers__carousel-track']}
            style={{
              transform: `translateX(-${(index - 1) * slideWidth}px)`,
              transition: transition ? 'transform 0.5s ease' : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {items.map((item, i) => (
              <div
                key={i}
                className={
                  i === index
                    ? `${styles['developers__carousel-item']} ${styles['developers__carousel-item--center']}`
                    : `${styles['developers__carousel-item']} ${styles['developers__carousel-item--adjacent']}`
                }
                style={{
                  backgroundImage: `url(${item.photoUrl})`,
                  ...itemTransitionStyle,
                }}
              >
                <div
                  className={`${styles.developers__info} ${
                    i === index ? styles['developers__info--active'] : ''
                  }`}
                  style={{
                    ...itemTransitionStyle,
                  }}
                >
                  <div className={styles.developers__header}>
                    <div className={styles.developers__name}>
                      <Link
                        className={styles['developers__platform-link']}
                        href={`/users/${item.userId}`}
                      >
                        {tDev(item.developerName)}
                      </Link>
                      <p className={styles.developers__role}>{item.role}</p>
                    </div>
                    <div className={styles.developers__linkedin}>
                      <Image
                        src="/images/link.svg"
                        alt="link"
                        width={16}
                        height={16}
                      />
                      <a
                        className={styles['developers__linkedin-link']}
                        href={item.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    </div>
                  </div>
                  <div className={styles.developers__description}>
                    {tDev(item.description)}
                  </div>
                </div>
                <div
                  className={`${styles.developers__filter} ${
                    i === index ? styles['developers__filter--active'] : ''
                  }`}
                  style={{
                    ...itemTransitionStyle,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div
          className={styles.developers__indicator}
          style={{
            gridTemplateColumns: `repeat(${developers.length}, 1fr)`,
          }}
        >
          {developers.map((_, i) => (
            <div
              key={i}
              className={`${styles['developers__indicator-item']} ${
                i === index - CLONES
                  ? styles['developers__indicator-item--active']
                  : ''
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
