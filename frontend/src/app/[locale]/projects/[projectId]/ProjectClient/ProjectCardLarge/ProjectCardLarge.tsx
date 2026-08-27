'use client';

import { ReactElement } from 'react';
import styles from './ProjectCardLarge.module.scss';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import ProjectCardFooter from '@/shared/components/ProjectCardFooter/ProjectCardFooter';
import Image from 'next/image';
import { useFormatter, useTranslations } from 'next-intl';
import { membersPipe } from '@/shared/utils/membersPipe';
import { projectDurationPipe } from '@/shared/utils/projectDurationPipe';
import { useShortLocale } from '@/hooks/useShortLocale';
import { ProjectCardExpandedInterface } from '@/shared/interfaces/project-card-expanded.interface';

interface ProjectCardLargeProps {
  project: ProjectCardExpandedInterface;
  user: AuthInterface;
}

export default function ProjectCardLarge({
  project,
  user,
}: ProjectCardLargeProps): ReactElement {
  const tStatus = useTranslations('status');
  const tProjectsPage = useTranslations('projectsPage');
  const locale = useShortLocale();
  const format = useFormatter();
  const formattedDate = format.dateTime(new Date(project.createdAt), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className={styles['project-card-large']}>
      <div
        className={`
              ${styles['project-card-large__image-wrapper']} 
              ${!project.logo ? styles['project-card-large__image-wrapper--empty'] : ''}
            `}
      >
        {project.logo ? (
          <Image
            className={styles['project-card-large__image']}
            src={project.logo.url}
            alt="logo"
            width={project.logo.width}
            height={project.logo.height}
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
            {project.category.categoryName[locale]}
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
              {formattedDate}
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
        <ProjectCardFooter project={project} user={user} size="large" />
      </div>
    </div>
  );
}
