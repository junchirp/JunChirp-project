'use client';

import { ReactElement } from 'react';
import styles from './ProjectInfoView.module.scss';
import Image from 'next/image';
import { membersPipe } from '@/shared/utils/membersPipe';
import { datePipe } from '@/shared/utils/datePipe';
import ProjectMenu from './ProjectMenu/ProjectMenu';
import { useLocale, useTranslations } from 'next-intl';
import { Locale } from '@/i18n/routing';
import { ProjectInterface } from '@/shared/interfaces/project.interface';

interface ProjectInfoViewProps {
  project: ProjectInterface;
  isOwner: boolean;
}

export default function ProjectInfoView({
  project,
  isOwner,
}: ProjectInfoViewProps): ReactElement {
  const tProjectsPage = useTranslations('projectsPage');
  const tStatus = useTranslations('status');
  const locale = useLocale();

  return (
    <>
      {project && (
        <div className={styles['project-info-view']}>
          <div
            className={`
              ${styles['project-info-view__image-wrapper']} 
              ${!project.logo ? styles['project-info-view__image-wrapper--empty'] : ''}
            `}
          >
            {project.logo ? (
              <Image
                className={styles['project-info-view__image']}
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
          <div className={styles['project-info-view__details']}>
            <div className={styles['project-info-view__header']}>
              <div className={styles['project-info-view__status-wrapper']}>
                <p
                  className={`
                ${styles['project-info-view__status']} 
                ${project.status === 'active' ? styles['project-info-view__status--active'] : styles['project-info-view__status--done']}
              `}
                >
                  {project.status === 'active'
                    ? tStatus('active')
                    : tStatus('completed')}
                </p>
                {project.status === 'active' && (
                  <ProjectMenu projectId={project.id} isOwner={isOwner} />
                )}
              </div>
              <h2 className={styles['project-info-view__title']}>
                {project.projectName}
              </h2>
            </div>
            <p className={styles['project-info-view__description']}>
              {project.description}
            </p>
            <p className={styles['project-info-view__category']}>
              {project.category.categoryName[locale as Locale]}
            </p>
            <div className={styles['project-info-view__team']}>
              <div className={styles['project-info-view__members']}>
                <Image
                  src="/images/users-2.svg"
                  alt="users"
                  width={24}
                  height={24}
                />
                <span className={styles['project-info-view__team-text']}>
                  {membersPipe(project.participantsCount, tProjectsPage)}
                </span>
              </div>
              <span className={styles['project-info-view__team-text']}>
                {datePipe(project.createdAt.toString(), 'DD/MM/YYYY')}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
