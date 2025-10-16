'use client';

import { ReactElement } from 'react';
import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';
import styles from './UserProjectCard.module.scss';
import Button from '@/shared/components/Button/Button';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { useRouter } from 'next/navigation';

interface UserProjectCardProps {
  project: ProjectCardInterface;
}

export default function UserProjectCard({
  project,
}: UserProjectCardProps): ReactElement {
  const router = useRouter();
  const cardClassName =
    project.status === 'active'
      ? `${styles['user-project-card']} ${styles['user-project-card--active']}`
      : `${styles['user-project-card']} ${styles['user-project-card--done']}`;
  const headerClassName =
    project.status === 'active'
      ? `${styles['user-project-card__header']} ${styles['user-project-card__header--active']}`
      : `${styles['user-project-card__header']} ${styles['user-project-card__header--done']}`;
  const statusClassName =
    project.status === 'active'
      ? `${styles['user-project-card__status']} ${styles['user-project-card__status--active']}`
      : `${styles['user-project-card__status']} ${styles['user-project-card__status--done']}`;
  const user = useAppSelector(authSelector.selectUser);
  const isMember = project.roles.some(
    (role) => role.user && role.user.id === user?.id,
  );

  const handleRedirect = (): void => {
    if (isMember) {
      router.push(`/projects/${project.id}/cab`);
    } else {
      router.push(`/projects/${project.id}`);
    }
  };

  return (
    <div className={cardClassName}>
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
        <Button
          variant="secondary-frame"
          color="green"
          onClick={handleRedirect}
        >
          {!isMember ? 'Переглянути деталі' : 'Перейти в кабінет проєкту'}
        </Button>
      </div>
    </div>
  );
}
