'use client';

import { ReactElement } from 'react';
import styles from './ProjectCardSmall.module.scss';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useFormatter, useTranslations } from 'next-intl';
import { membersPipe } from '@/shared/utils/membersPipe';
import { projectDurationPipe } from '@/shared/utils/projectDurationPipe';
import ProjectCardFooter from '@/shared/components/ProjectCardFooter/ProjectCardFooter';
import { useShortLocale } from '@/hooks/useShortLocale';
import { ProjectCardExpandedInterface } from '@/shared/interfaces/project-card-expanded.interface';

interface ProjectCardSmallProps {
  project: ProjectCardExpandedInterface;
  user: AuthInterface;
}

export default function ProjectCardSmall({
  project,
  user,
}: ProjectCardSmallProps): ReactElement {
  const isMyProject =
    project.roles.some((role) => role.users.some((u) => u.id === user.id)) ||
    project.ownerId === user.id;
  const locale = useShortLocale();
  const format = useFormatter();
  const formattedDate = format.dateTime(new Date(project.createdAt), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const currentUserRole =
    project.ownerId === user.id
      ? 'Product Owner'
      : project.roles.find((role) => role.users.some((u) => u.id === user.id))
          ?.roleType.roleName;

  const tProjectsPage = useTranslations('projectsPage');
  const tStatus = useTranslations('status');

  return (
    <div className={styles['project-card-small']}>
      <div className={styles['project-card-small__content']}>
        <div className={styles['project-card-small__header-wrapper']}>
          <div
            className={`
              ${styles['project-card-small__image-wrapper']} 
              ${!project.logo ? styles['project-card-small__image-wrapper--empty'] : ''}
            `}
          >
            {project.logo ? (
              <Image
                className={styles['project-card-small__image']}
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
          <div className={styles['project-card-small__header']}>
            <p
              className={`
                ${styles['project-card-small__status']} 
                ${project.status === 'active' ? styles['project-card-small__status--active'] : styles['project-card-small__status--done']}
              `}
            >
              {project.status === 'active'
                ? tStatus('active')
                : tStatus('completed')}
            </p>
            <Link
              className={styles['project-card-small__link']}
              href={
                isMyProject
                  ? `/projects/${project.id}/dashboard`
                  : `/projects/${project.id}`
              }
            >
              {project.projectName}
            </Link>
            {!!currentUserRole && (
              <p className={styles['project-card-small__role']}>
                {currentUserRole}
              </p>
            )}
          </div>
        </div>
        <p className={styles['project-card-small__description']}>
          {project.description}
        </p>
        <p className={styles['project-card-small__category']}>
          {project.category.categoryName[locale]}
        </p>
        <div className={styles['project-card-small__team']}>
          <div className={styles['project-card-small__members']}>
            <Image
              src="/images/users-2.svg"
              alt="users"
              width={24}
              height={24}
            />
            <span className={styles['project-card-small__team-text']}>
              {membersPipe(project.participantsCount, tProjectsPage)}
            </span>
          </div>
          <span className={styles['project-card-small__team-text']}>
            {formattedDate}
          </span>
        </div>
        {project.duration !== null && project.status === 'done' && (
          <p className={styles['project-card-small__duration']}>
            <span>{tProjectsPage('duration.title')}:</span>
            <span className={styles['project-card-small__duration-value']}>
              {projectDurationPipe(project.duration, tProjectsPage)}
            </span>
          </p>
        )}
      </div>
      <ProjectCardFooter
        project={project}
        user={user}
        size="small"
        className={styles['project-card__label']}
      />
    </div>
  );
}
