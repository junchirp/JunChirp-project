import { ReactElement } from 'react';
import styles from './Quote.module.scss';
import Image from 'next/image';

export default function Quote(): ReactElement {
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
        <h2 className={styles.quote__quote}>
          Разом ми досягаємо більше. Кожен внесок важливий, а успіх команди
          &mdash; це успіх кожного.
        </h2>
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
