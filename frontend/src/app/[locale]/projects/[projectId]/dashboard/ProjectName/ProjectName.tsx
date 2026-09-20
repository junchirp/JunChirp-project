'use client';

import { ReactElement } from 'react';
import styles from './ProjectName.module.scss';

interface ProjectNameProps {
  projectName: string | undefined;
}

export default function ProjectName({
  projectName,
}: ProjectNameProps): ReactElement {
  return projectName ? (
    <div className={styles['project-name']}>
      <h2 className={styles['project-name__title']}>Кабінет проєкту</h2>
      <h2 className={styles['project-name__title']}>{projectName}</h2>
    </div>
  ) : (
    <div className={styles['project-name']}>
      <div className={styles['project-name__skeleton']} />
      <div className={styles['project-name__skeleton']} />
    </div>
  );
}
