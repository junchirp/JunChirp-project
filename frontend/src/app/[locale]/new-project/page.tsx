import { ReactElement } from 'react';
import styles from './page.module.scss';
import Image from 'next/image';
import NewProjectForm from './NewProjectForm/NewProjectForm';
import AccessGuard from '@/shared/components/AccessGuard/AccessGuard';
import { getTranslations } from 'next-intl/server';

export default async function NewProject(): Promise<ReactElement> {
  const t = await getTranslations('newProject');
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
          <h2 className={styles['new-project__title']}>[{t('title')}]</h2>
          <p className={styles['new-project__description']}>
            {t('description')}
          </p>
          <Image
            className={`${styles['new-project__image']} ${styles['new-project__image--last']}`}
            src="/images/star.svg"
            alt="star"
            width={33}
            height={35}
          />
        </div>
        <NewProjectForm />
      </div>
    </AccessGuard>
  );
}
