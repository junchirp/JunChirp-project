'use client';

import { ReactElement } from 'react';
import styles from './page.module.scss';
import Image from 'next/image';
import AuthGuard from '@/shared/components/AuthGuard/AuthGuard';
import ProjectForm from '@/shared/components/ProjectForm/ProjectForm';
import { usePathname } from '@/i18n/routing';

export default function NewProject(): ReactElement {
  const pathname = usePathname();

  return (
    <AuthGuard
      requireVerified
      redirectTo={`/auth/login?next=${encodeURIComponent(pathname)}`}
    >
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
