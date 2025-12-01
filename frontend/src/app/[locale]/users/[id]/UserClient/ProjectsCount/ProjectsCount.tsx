'use client';

import { ReactElement } from 'react';
import styles from './ProjectsCount.module.scss';
import { useTranslations } from 'next-intl';

interface ProjectsCountProps {
  status: 'active' | 'done';
  count: number;
  active: boolean;
  onClick: () => void;
}

export default function ProjectsCount(props: ProjectsCountProps): ReactElement {
  const { status, count, active, onClick } = props;

  const classNameStatus =
    status === 'active'
      ? styles['projects-count--active']
      : styles['projects-count--done'];
  const activeClass = active ? styles['projects-count--selected'] : '';
  const t = useTranslations('profile');

  return (
    <div
      className={`${styles['projects-count']} ${classNameStatus} ${activeClass}`}
      onClick={onClick}
    >
      <p className={styles['projects-count__title']}>
        {status === 'active' ? t('activeProjects') : t('completedProjects')}
      </p>
      <p className={styles['projects-count__count']}>{count}</p>
    </div>
  );
}
