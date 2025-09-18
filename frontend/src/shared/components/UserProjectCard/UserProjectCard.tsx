import { ReactElement } from 'react';
import { ProjectCardInterface } from '../../interfaces/project-card.interface';
import styles from './UserProjectCard.module.scss';
import Button from '../Button/Button';

interface UserProjectCardProps {
  project: ProjectCardInterface;
  detailsLevel?: 'card' | 'full';
}

export default function UserProjectCard({
  project,
  detailsLevel = 'card',
}: UserProjectCardProps): ReactElement {
  const headerClassName =
    project.status === 'active'
      ? `${styles['user-project-card__header']} ${styles['user-project-card__header--active']}`
      : `${styles['user-project-card__header']} ${styles['user-project-card__header--done']}`;
  const statusClassName =
    project.status === 'active'
      ? `${styles['user-project-card__status']} ${styles['user-project-card__status--active']}`
      : `${styles['user-project-card__status']} ${styles['user-project-card__status--done']}`;

  return (
    <div className={styles['user-project-card']}>
      <div className={headerClassName} />
      <div className={styles['user-project-card__inner']}>
        <div className={styles['user-project-card__content']}>
          <div className={statusClassName}>
            {project.status === 'active' ? 'Активний' : 'Завершений'}
          </div>
          <div className={styles['user-project-card__text']}>
            <h3 className={styles['user-project-card__title']}>
              {project.projectName}
            </h3>
            <p className={styles['user-project-card__description']}>
              {project.description}
            </p>
          </div>
        </div>
        <Button variant="secondary-frame" color="green">
          {detailsLevel === 'card'
            ? 'Переглянути деталі'
            : 'Перейти в кабінет проєкту'}
        </Button>
      </div>
    </div>
  );
}
