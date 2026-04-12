'use client';

import { ReactElement } from 'react';
import styles from './ProjectCardLarge.module.scss';

export default function ProjectCardLarge(): ReactElement {
  return (
    <div className={styles['project-card-large']}>
      <div className={styles['project-card-large__image-wrapper']}></div>
      <div className={styles['project-card-large__content']}>
        <div className={styles['project-card-large__main-content']}>
          <div className={styles['project-card-large__header']}>
            <p className={styles['project-card-large__status']}></p>
            <div className={styles['project-card-large__title']}></div>
          </div>
          <div className={styles['project-card-large__info']}>
            <p className={styles['project-card-large__description']}></p>
            <p className={styles['project-card-large__category']}></p>
            <div className={styles['project-card-large__team']}></div>
            <p className={styles['project-card-large__duration']}></p>
          </div>
        </div>
        <div
          style={{ width: '100%', height: '200px', backgroundColor: 'green' }}
        >
          Footer: coming soon
        </div>
      </div>
    </div>
  );
}
