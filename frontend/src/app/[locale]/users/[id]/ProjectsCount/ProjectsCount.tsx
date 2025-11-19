import { ReactElement } from 'react';
import styles from './ProjectsCount.module.scss';

interface ProjectsCountProps {
  status: 'active' | 'done';
  count: number;
}

export default function ProjectsCount({
  status,
  count,
}: ProjectsCountProps): ReactElement {
  const classNameStatus =
    status === 'active'
      ? styles['projects-count--active']
      : styles['projects-count--done'];

  return (
    <div className={`${styles['projects-count']} ${classNameStatus}`}>
      <p className={styles['projects-count__title']}>
        {status === 'active' ? 'Активні' : 'Завершені'} проєкти
      </p>
      <p className={styles['projects-count__count']}>{count}</p>
    </div>
  );
}
