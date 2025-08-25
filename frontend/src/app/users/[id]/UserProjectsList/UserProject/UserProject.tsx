import { ReactElement } from 'react';
import { ProjectCardInterface } from '../../../../../shared/interfaces/project-card.interface';
import styles from './UserProject.module.scss';
import Button from '../../../../../shared/components/Button/Button';

interface UserProjectProps {
  project: ProjectCardInterface;
}

export default function UserProject({
  project,
}: UserProjectProps): ReactElement {
  const headerClassName =
    project.status === 'active'
      ? `${styles['user-project__header']} ${styles['user-project__header--active']}`
      : `${styles['user-project__header']} ${styles['user-project__header--done']}`;
  const statusClassName =
    project.status === 'active'
      ? `${styles['user-project__status']} ${styles['user-project__status--active']}`
      : `${styles['user-project__status']} ${styles['user-project__status--done']}`;

  return (
    <div className={styles['user-project']}>
      <div className={headerClassName}></div>
      <div className={styles['user-project__inner']}>
        <div className={styles['user-project__content']}>
          <div className={statusClassName}>
            {project.status === 'active' ? 'Активний' : 'Завершений'}
          </div>
          <div className={styles['user-project__text']}>
            <h3 className={styles['user-project__title']}>
              {project.projectName}
            </h3>
            <p className={styles['user-project__description']}>
              {project.description}
            </p>
          </div>
        </div>
        <Button variant="secondary-frame" color="green">
          Переглянути деталі
        </Button>
      </div>
    </div>
  );
}
