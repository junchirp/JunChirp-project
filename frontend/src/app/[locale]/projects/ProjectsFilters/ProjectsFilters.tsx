'use client';

import { ReactElement } from 'react';
import styles from './ProjectsFilters.module.scss';
import ProjectsFiltersForm from './ProjectsFiltersForm/ProjectsFiltersForm';

export default function ProjectsFilters(): ReactElement {
  return (
    <div className={styles['projects-filters']}>
      <h3 className={styles['projects-filters__title']}>Фільтр проєктів:</h3>
      <ProjectsFiltersForm />
      <div className={styles['projects-filters__border']}></div>
    </div>
  );
}
