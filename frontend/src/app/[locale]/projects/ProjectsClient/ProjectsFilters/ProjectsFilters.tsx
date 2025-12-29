'use client';

import { ReactElement } from 'react';
import styles from './ProjectsFilters.module.scss';
import ProjectsFiltersForm from './ProjectsFiltersForm/ProjectsFiltersForm';
import { useTranslations } from 'next-intl';

export default function ProjectsFilters(): ReactElement {
  const t = useTranslations('projectsPage');
  return (
    <div className={styles['projects-filters']}>
      <h3 className={styles['projects-filters__title']}>{t('filterName')}:</h3>
      <ProjectsFiltersForm />
      <div className={styles['projects-filters__border']}></div>
    </div>
  );
}
