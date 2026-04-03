'use client';

import { ReactElement } from 'react';
import styles from './page.module.scss';
import Image from 'next/image';
import ProjectForm from '@/shared/components/ProjectForm/ProjectForm';
import AccessGuard from '@/shared/components/AccessGuard/AccessGuard';

export default function NewProject(): ReactElement {
  return (
    <AccessGuard mode="discord">
      <div className={styles['new-project']}>
        <div className={styles['new-project__banner']}>
          <Image
            className={`${styles['new-project__image']} ${styles['new-project__image--first']}`}
            src="/images/star.svg"
            alt="star"
            width={33}
            height={35}
          />
          <h2 className={styles['new-project__title']}>[Створення проєкту]</h2>
          <p className={styles['new-project__description']}>
            Заповни основну інформацію про свій проєкт, щоб знайти команду
            однодумців.
          </p>
          <Image
            className={`${styles['new-project__image']} ${styles['new-project__image--last']}`}
            src="/images/star.svg"
            alt="star"
            width={33}
            height={35}
          />
        </div>
        <ProjectForm />
      </div>
    </AccessGuard>
  );
}
