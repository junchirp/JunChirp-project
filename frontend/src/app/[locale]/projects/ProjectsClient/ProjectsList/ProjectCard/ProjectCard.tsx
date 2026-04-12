'use client';

import { ReactElement } from 'react';
import styles from './ProjectCard.module.scss';
import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import Image from 'next/image';
import { Link, Locale } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { membersPipe } from '@/shared/utils/membersPipe';
import { datePipe } from '@/shared/utils/datePipe';
import { projectDurationPipe } from '@/shared/utils/projectDurationPipe';
import ProjectCardFooter from '@/shared/components/ProjectCardFooter/ProjectCardFooter';

interface ProjectCardProps {
  project: ProjectCardInterface;
  invites: ProjectParticipationInterface[];
  requests: ProjectParticipationInterface[];
  user: AuthInterface | null;
}

export default function ProjectCard({
  project,
  invites,
  requests,
  user,
}: ProjectCardProps): ReactElement {
  const isMyProject = project.roles
    .map((role) => role.user)
    .some((member) => member && member.id === user?.id);
  const locale = useLocale();

  const tProjectsPage = useTranslations('projectsPage');
  const tStatus = useTranslations('status');

  return (
    <div className={styles['project-card']}>
      <div className={styles['project-card__content']}>
        <div className={styles['project-card__header-wrapper']}>
          <div
            className={`
              ${styles['project-card__image-wrapper']} 
              ${!project.logoUrl ? styles['project-card__image-wrapper--empty'] : ''} 
              ${styles['project-card__image-wrapper--small']}
            `}
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
          <div className={styles['project-card__header']}>
            <p
              className={`
                ${styles['project-card__status']} 
                ${project.status === 'active' ? styles['project-card__status--active'] : styles['project-card__status--done']}
              `}
            >
              {project.status === 'active'
                ? tStatus('active')
                : tStatus('completed')}
            </p>
            <Link
              className={styles['project-card__link']}
              href={
                isMyProject
                  ? `/projects/${project.id}/cab`
                  : `/projects/${project.id}`
              }
            >
              {project.projectName}
            </Link>
          </div>
        </div>
        <p className={styles['project-card__description']}>
          {project.description}
        </p>
        <p className={styles['project-card__category']}>
          {project.category.categoryName[locale as Locale]}
        </p>
        <div className={styles['project-card__team']}>
          <div className={styles['project-card__members']}>
            <Image
              src="/images/users-2.svg"
              alt="users"
              width={24}
              height={24}
            />
            <span className={styles['project-card__team-text']}>
              {membersPipe(project.participantsCount, tProjectsPage)}
            </span>
          </div>
          <span className={styles['project-card__team-text']}>
            {datePipe(project.createdAt.toString(), 'DD/MM/YYYY')}
          </span>
        </div>
        {project.duration !== null && project.status === 'done' && (
          <p className={styles['project-card__duration']}>
            <span>{tProjectsPage('duration.title')}:</span>
            <span className={styles['project-card__duration-value']}>
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
        size="small"
        className={styles['project-card__label']}
      />
    </div>
  );
}
