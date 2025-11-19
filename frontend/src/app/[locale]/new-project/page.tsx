'use client';

import { ReactElement } from 'react';
import styles from './page.module.scss';
import Image from 'next/image';
import AuthGuard from '@/shared/components/AuthGuard/AuthGuard';
import ProjectForm from '@/shared/components/ProjectForm/ProjectForm';

export default function NewProject(): ReactElement {
  return (
    <AuthGuard requireVerified>
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
    </AuthGuard>
  );
}
