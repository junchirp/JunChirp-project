'use client';

import { ReactElement } from 'react';
import styles from './ProjectName.module.scss';
import { useTranslations } from 'next-intl';

interface ProjectNameProps {
  projectName: string | undefined;
}

export default function ProjectName({
  projectName,
}: ProjectNameProps): ReactElement {
  const t = useTranslations('dashboard');

  return projectName ? (
    <div className={styles['project-name']}>
      <h2 className={styles['project-name__title']}>{t('title')}</h2>
      <h2 className={styles['project-name__title']}>{projectName}</h2>
    </div>
  ) : (
    <div className={styles['project-name']}>
      <div className={styles['project-name__skeleton']} />
      <div className={styles['project-name__skeleton']} />
    </div>
  );
}
