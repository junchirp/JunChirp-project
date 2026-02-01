import { ReactElement } from 'react';
import styles from './HomeSkeleton.module.scss';

export default function HomeSkeleton(): ReactElement {
  return (
    <div className={styles['home-skeleton']}>
      <div className={styles['home-skeleton__1']}>
        <div className={styles['home-skeleton__2']}>
          <div className={styles['home-skeleton__3']}>
            <div className={styles['home-skeleton__4']} />
          </div>
        </div>
      </div>
      <div className={styles['home-skeleton__1']}>
        <div className={styles['home-skeleton__2']} />
      </div>
      <div className={styles['home-skeleton__1']}>
        <div className={styles['home-skeleton__2']} />
      </div>
      <div className={styles['home-skeleton__1']}>
        <div className={styles['home-skeleton__2']} />
      </div>
      <div className={styles['home-skeleton__1']}>
        <div className={styles['home-skeleton__2']} />
      </div>
      <div className={styles['home-skeleton__1']}>
        <div className={styles['home-skeleton__2']} />
      </div>
    </div>
  );
}
