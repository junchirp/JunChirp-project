'use client';

import { ReactElement, useState } from 'react';
import styles from './OverviewView.module.scss';
import Image from 'next/image';
import { membersPipe } from '@/shared/utils/membersPipe';
import ProjectMenu from './ProjectMenu/ProjectMenu';
import { useFormatter, useTranslations } from 'next-intl';
import { ProjectInterface } from '@/shared/interfaces/project.interface';
import { useSystemLocale } from '@/hooks/useSystemLocale';
import {
  useCompleteProjectMutation,
  useDeleteProjectMutation,
  useLeaveProjectMutation,
} from '@/api/projectsApi';
import LeaveProjectPopup from './LeaveProjectPopup/LeaveProjectPopup';
import { useToast } from '@/hooks/useToast';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { useRouter } from '@/i18n/routing';
import DeleteProjectPopup from './DeleteProjectPopup/DeleteProjectPopup';
import CompleteProjectPopup from './CompleteProjectPopup/CompleteProjectPopup';

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
  const tLeavePopup = useTranslations('leaveProjectPopup');
  const tDeletePopup = useTranslations('deleteProjectPopup');
  const tCompletePopup = useTranslations('completeProjectPopup');
  const locale = useSystemLocale();
  const format = useFormatter();
  const formattedDate = format.dateTime(new Date(project.createdAt), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const [leavePopupOpen, setLeavePopupOpen] = useState(false);
  const [leaveProject, { isLoading: leaveLoading }] = useLeaveProjectMutation();
  const { showToast, isActive } = useToast();
  const router = useRouter();
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [deleteProject, { isLoading: deleteLoading }] =
    useDeleteProjectMutation();
  const [completePopupOpen, setCompletePopupOpen] = useState(false);
  const [completeProject, { isLoading: completeLoading }] =
    useCompleteProjectMutation();

  const openLeavePopup = (): void => setLeavePopupOpen(true);
  const closeLeavePopup = (): void => setLeavePopupOpen(false);
  const openDeletePopup = (): void => setDeletePopupOpen(true);
  const closeDeletePopup = (): void => setDeletePopupOpen(false);
  const openCompletePopup = (): void => setCompletePopupOpen(true);
  const closeCompletePopup = (): void => setCompletePopupOpen(false);

  const exitFromProject = async (): Promise<void> => {
    if (isActive(ToastKeysEnum.PROJECT)) {
      return;
    }

    try {
      await leaveProject(project.id).unwrap();

      showToast({
        severity: 'success',
        summary: tLeavePopup('success'),
        life: 3000,
        actionKey: ToastKeysEnum.PROJECT,
      });

      router.replace(`/projects/${project.id}`);
    } catch {
      showToast({
        severity: 'error',
        summary: tLeavePopup('error'),
        life: 3000,
        actionKey: ToastKeysEnum.PROJECT,
      });
    }
  };

  const handleDeleteProject = async (): Promise<void> => {
    if (isActive(ToastKeysEnum.PROJECT)) {
      return;
    }

    try {
      await deleteProject(project.id).unwrap();

      showToast({
        severity: 'success',
        summary: tDeletePopup('success'),
        life: 3000,
        actionKey: ToastKeysEnum.PROJECT,
      });

      router.replace('/projects');
    } catch {
      showToast({
        severity: 'error',
        summary: tDeletePopup('error'),
        life: 3000,
        actionKey: ToastKeysEnum.PROJECT,
      });
    }
  };

  const handleCompleteProject = async (): Promise<void> => {
    if (isActive(ToastKeysEnum.PROJECT)) {
      return;
    }

    try {
      await completeProject(project.id).unwrap();

      showToast({
        severity: 'success',
        summary: tCompletePopup('success'),
        life: 3000,
        actionKey: ToastKeysEnum.PROJECT,
      });
    } catch {
      showToast({
        severity: 'error',
        summary: tCompletePopup('error'),
        life: 3000,
        actionKey: ToastKeysEnum.PROJECT,
      });
    } finally {
      closeCompletePopup();
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
              <ProjectMenu
                project={project}
                isOwner={isOwner}
                onLeave={openLeavePopup}
                onDelete={openDeletePopup}
                onComplete={openCompletePopup}
              />
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
      <LeaveProjectPopup
        isLoading={leaveLoading}
        project={project}
        isOpen={leavePopupOpen}
        onClose={closeLeavePopup}
        onConfirm={exitFromProject}
      />
      <DeleteProjectPopup
        isLoading={deleteLoading}
        project={project}
        isOpen={deletePopupOpen}
        onClose={closeDeletePopup}
        onConfirm={handleDeleteProject}
      />
      <CompleteProjectPopup
        isLoading={completeLoading}
        isOpen={completePopupOpen}
        onClose={closeCompletePopup}
        onConfirm={handleCompleteProject}
      />
    </>
  );
}
