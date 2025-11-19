'use client';

import { ReactElement } from 'react';
import styles from './UserSkeleton.module.scss';

export default function UserSkeleton(): ReactElement {
  return (
    <div className={styles['user-skeleton']}>
      <div className={styles['user-skeleton__1']} />
      <div className={styles['user-skeleton__2']}>
        <div className={styles['user-skeleton__3']} />
        <div className={styles['user-skeleton__4']} />
        <div className={styles['user-skeleton__3']} />
        <div className={styles['user-skeleton__4']} />
      </div>
      <div className={styles['user-skeleton__5']}>
        <div className={styles['user-skeleton__6']} />
        <div className={styles['user-skeleton__6']} />
        <div className={styles['user-skeleton__6']} />
        <div className={styles['user-skeleton__7']} />
        <div className={styles['user-skeleton__7']} />
      </div>
      <div className={styles['user-skeleton__8']}>
        <div className={styles['user-skeleton__9']}></div>
      </div>
    </div>
  );
}
