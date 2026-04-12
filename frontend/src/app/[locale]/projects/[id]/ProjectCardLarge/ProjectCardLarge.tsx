'use client';

import { ReactElement } from 'react';
import styles from './ProjectCardLarge.module.scss';
import { ProjectCardInterface } from '../../../../../shared/interfaces/project-card.interface';
import { ProjectParticipationInterface } from '../../../../../shared/interfaces/project-participation.interface';
import { AuthInterface } from '../../../../../shared/interfaces/auth.interface';
import ProjectCardFooter from '../../../../../shared/components/ProjectCardFooter/ProjectCardFooter';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Locale } from '../../../../../i18n/routing';
import { membersPipe } from '../../../../../shared/utils/membersPipe';
import { datePipe } from '../../../../../shared/utils/datePipe';
import { projectDurationPipe } from '../../../../../shared/utils/projectDurationPipe';

interface ProjectCardProps {
  project: ProjectCardInterface;
  invites: ProjectParticipationInterface[];
  requests: ProjectParticipationInterface[];
  user: AuthInterface | null;
  size?: 'small' | 'large';
}

export default function ProjectCardLarge({
  project,
  invites,
  requests,
  user,
}: ProjectCardProps): ReactElement {
  const tStatus = useTranslations('status');
  const tProjectsPage = useTranslations('projectsPage');
  const locale = useLocale();

  return (
    <div className={styles['project-card-large']}>
      <div
        className={`
              ${styles['project-card-large__image-wrapper']} 
              ${!project.logoUrl ? styles['project-card-large__image-wrapper--empty'] : ''}
            `}
      >
        {project.logoUrl ? (
          <Image
            className={styles['project-card-large__image']}
            src={project.logoUrl}
            alt="logo"
            width={236}
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
      <div className={styles['project-card-large__content']}>
        <div className={styles['project-card-large__info']}>
          <div className={styles['project-card-large__header']}>
            <p
              className={`
                ${styles['project-card-large__status']} 
                ${
                  project.status === 'active'
                    ? styles['project-card-large__status--active']
                    : styles['project-card-large__status--done']
                }
              `}
            >
              {project.status === 'active'
                ? tStatus('active')
                : tStatus('completed')}
            </p>
            <div className={styles['project-card-large__title']}>
              {project.projectName}
            </div>
          </div>
          <p className={styles['project-card-large__description']}>
            {project.description}
          </p>
          <p className={styles['project-card-large__category']}>
            {project.category.categoryName[locale as Locale]}
          </p>
          <div className={styles['project-card-large__team']}>
            <div className={styles['project-card-large__members']}>
              <Image
                src="/images/users-2.svg"
                alt="users"
                width={24}
                height={24}
              />
              <span className={styles['project-card-large__team-text']}>
                {membersPipe(project.participantsCount, tProjectsPage)}
              </span>
            </div>
            <span className={styles['project-card-large__team-text']}>
              {datePipe(project.createdAt.toString(), 'DD/MM/YYYY')}
            </span>
          </div>
          {project.duration !== null && project.status === 'done' && (
            <p className={styles['project-card-large__duration']}>
              <span>{tProjectsPage('duration.title')}:</span>
              <span className={styles['project-card-large__duration-value']}>
                {projectDurationPipe(project.duration, tProjectsPage)}
              </span>
            </p>
          )}
        </div>
        <ProjectCardFooter
          project={project}
          invites={invites}
          requests={requests}
          user={user}
          size="large"
        />
      </div>
    </div>
  );
}
