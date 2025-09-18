import { ReactElement } from 'react';
import styles from './ProjectCard.module.scss';
import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';
import Button from '../../../../shared/components/Button/Button';
import Image from 'next/image';

interface ProjectCardProps {
  project: ProjectCardInterface;
  invitesProjectsIds: string[];
  requestsProjectsIds: string[];
  myProjectsIds: string[];
}

export default function ProjectCard({
  project,
  invitesProjectsIds,
  requestsProjectsIds,
  myProjectsIds,
}: ProjectCardProps): ReactElement {
  const isInvite = invitesProjectsIds.includes(project.id);
  const isRequest = requestsProjectsIds.includes(project.id);
  const isMyProject = myProjectsIds.includes(project.id);

  return (
    <div className={styles['project-card']}>
      <div className={styles['project-card__info']}>
        <div className={styles['project-card__header']}>
          <div
            className={`${styles['project-card__image-wrapper']} ${!project.logoUrl ? styles['project-card__image-wrapper--empty'] : ''}`}
          >
            {project.logoUrl ? (
              <Image
                className={styles['project-card__image']}
                src={project.logoUrl}
                alt="logo"
                width={180}
                height={0}
              />
            ) : (
              <Image
                src="/images/empty-image.svg"
                alt="empty-logo"
                width={80}
                height={80}
              />
            )}
          </div>
          <div className={styles['project-card__title-wrapper']}>
            <p
              className={`${styles['project-card__status']} ${project.status === 'active' ? styles['project-card__status--active'] : styles['project-card__status--done']}`}
            >
              {project.status === 'active' ? 'Активний' : 'Завершений'}
            </p>
            <h3 className={styles['project-card__title']}>
              {project.projectName}
            </h3>
          </div>
        </div>
        <p className={styles['project-card__description']}>
          {project.description}
        </p>
        <p className={styles['project-card__category']}>
          {project.category.categoryName}
        </p>
        <div className={styles['project-card__footer']}>
          <div className={styles['project-card__team']}>
            <div className={styles['project-card__members']}>111</div>
            <div className={styles['project-card__created']}>
              {project.createdAt.toString()}
            </div>
          </div>
        </div>
      </div>
      <div className={styles['project-card__actions']}>
        {isMyProject && (
          <Button color="green" variant="secondary-frame">
            Перейти в кабінет проєкту
          </Button>
        )}
        {isRequest && (
          <Button color="green" disabled>
            Запит відправлено
          </Button>
        )}
        {isInvite && (
          <>
            <Button color="red" variant="secondary-frame">
              Відхилити
            </Button>
            <Button color="green">Прийняти</Button>
          </>
        )}
        {!isMyProject && !isInvite && !isRequest && (
          <Button color="green" disabled={project.status === 'done'}>
            Подати заявку
          </Button>
        )}
      </div>
    </div>
  );
}
