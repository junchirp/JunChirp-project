'use client';

import { ReactElement, useState } from 'react';
import styles from './OverviewView.module.scss';
import Image from 'next/image';
import { membersPipe } from '@/shared/utils/membersPipe';
import ProjectMenu from './ProjectMenu/ProjectMenu';
import { useFormatter, useTranslations } from 'next-intl';
import { ProjectInterface } from '@/shared/interfaces/project.interface';
import { useSystemLocale } from '@/hooks/useSystemLocale';
import { useLeaveProjectMutation } from '@/api/projectsApi';
import LeaveProjectPopup from './LeaveProjectPopup/LeaveProjectPopup';
import { useToast } from '@/hooks/useToast';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { useRouter } from '@/i18n/routing';

interface OverviewViewProps {
  project: ProjectInterface;
  isOwner: boolean;
}

export default function OverviewView({
  project,
  isOwner,
}: OverviewViewProps): ReactElement {
  const tProjectsPage = useTranslations('projectsPage');
  const tStatus = useTranslations('status');
  const tPopup = useTranslations('leaveProjectPopup');
  const locale = useSystemLocale();
  const format = useFormatter();
  const formattedDate = format.dateTime(new Date(project.createdAt), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const [leavePopupOpen, setLeavePopupOpen] = useState(false);
  const [leaveProject, { isLoading }] = useLeaveProjectMutation();
  const { showToast, isActive } = useToast();
  const router = useRouter();

  const openLeavePopup = (): void => setLeavePopupOpen(true);
  const closeLeavePopup = (): void => setLeavePopupOpen(false);

  const exitFromProject = async (): Promise<void> => {
    if (isActive(ToastKeysEnum.LEAVE_PROJECT)) {
      return;
    }

    try {
      await leaveProject(project.id).unwrap();
      closeLeavePopup();
      showToast({
        severity: 'success',
        summary: tPopup('success'),
        life: 3000,
        actionKey: ToastKeysEnum.LEAVE_PROJECT,
      });
      router.replace(`/projects/${project.id}`);
    } catch {
      closeLeavePopup();
      showToast({
        severity: 'error',
        summary: tPopup('error'),
        life: 3000,
        actionKey: ToastKeysEnum.LEAVE_PROJECT,
      });
    }
  };

  return (
    <>
      <div className={styles['overview-view']}>
        <div
          className={`
              ${styles['overview-view__image-wrapper']} 
              ${!project.logo ? styles['overview-view__image-wrapper--empty'] : ''}
            `}
        >
          {project.logo ? (
            <Image
              className={styles['overview-view__image']}
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
        <div className={styles['overview-view__details']}>
          <div className={styles['overview-view__header']}>
            <div className={styles['overview-view__status-wrapper']}>
              <p
                className={`
                ${styles['overview-view__status']} 
                ${project.status === 'active' ? styles['overview-view__status--active'] : styles['overview-view__status--done']}
              `}
              >
                {project.status === 'active'
                  ? tStatus('active')
                  : tStatus('completed')}
              </p>
              {project.status === 'active' && (
                <ProjectMenu
                  projectId={project.id}
                  isOwner={isOwner}
                  onLeave={openLeavePopup}
                />
              )}
            </div>
            <h2 className={styles['overview-view__title']}>
              {project.projectName}
            </h2>
          </div>
          <p className={styles['overview-view__description']}>
            {project.description}
          </p>
          <p className={styles['overview-view__category']}>
            {project.category.categoryName[locale]}
          </p>
          <div className={styles['overview-view__team']}>
            <div className={styles['overview-view__members']}>
              <Image
                src="/images/users-2.svg"
                alt="users"
                width={24}
                height={24}
              />
              <span className={styles['overview-view__team-text']}>
                {membersPipe(project.participantsCount, tProjectsPage)}
              </span>
            </div>
            <span className={styles['overview-view__team-text']}>
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
      {leavePopupOpen && (
        <LeaveProjectPopup
          isLoading={isLoading}
          project={project}
          isOpen={leavePopupOpen}
          onClose={closeLeavePopup}
          onConfirm={exitFromProject}
        />
      )}
    </>
  );
}
