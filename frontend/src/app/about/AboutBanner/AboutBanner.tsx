import { ReactElement } from 'react';
import styles from './AboutBanner.module.scss';
import Image from 'next/image';

export default function AboutBanner(): ReactElement {
  return (
    <div className={styles['about-banner']}>
      <div className={styles['about-banner__inner']}>
        <h2 className={styles['about-banner__title']}>
          Зроби перший крок до своєї ІТ-кар'єри з{' '}
          <span className={styles['about-banner__green-text']}>
            [JunChirp!]
          </span>
        </h2>
        <div className={styles['about-banner__content-wrapper']}>
          <div className={styles['about-banner__content']}>
            <p>
              Ласкаво просимо на JunChirp &mdash; платформу, де кожен джуніор
              отримує реальний досвід, розвиває навички та створює сильне
              портфоліо через роботу над проєктами та участь у челенджах!
            </p>
            <p>
              <span className={styles['about-banner__green-text']}>
                [НАША МІСІЯ]
              </span>{' '}
              &mdash; допомогти тобі стати впевненим спеціалістом через
              практичний досвід і роботу в команді. Кожне завдання тут &mdash;
              це новий рівень твого зростання, а кожна перемога наближає до
              кар’єри в ІТ.
            </p>
          </div>
          <Image
            src="./images/bird-4.svg"
            alt="bird"
            width={371}
            height={311}
          />
        </div>
      </div>
    </div>
  );
}
