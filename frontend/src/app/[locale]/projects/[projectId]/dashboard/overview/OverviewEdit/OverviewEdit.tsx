'use client';

import React, { ReactElement } from 'react';
import styles from './OverviewEdit.module.scss';
import { ProjectInterface } from '@/shared/interfaces/project.interface';
import EditProjectForm from './EditProjectForm/EditProjectForm';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import { membersPipe } from '@/shared/utils/membersPipe';
import Button from '@/shared/components/Button/Button';
import { useRouter } from '@/i18n/routing';
import ProjectImageUpload from './ProjectImageUpload/ProjectImageUpload';

interface OverviewEditProps {
  project: ProjectInterface;
}

export default function OverviewEdit({
  project,
}: OverviewEditProps): ReactElement {
  const tStatus = useTranslations('status');
  const tProjectsPage = useTranslations('projectsPage');
  const tButtons = useTranslations('buttons');
  const router = useRouter();
  const format = useFormatter();
  const formattedDate = format.dateTime(new Date(project.createdAt), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const cancelEditProject = (): void => {
    router.replace(`/projects/${project.id}/dashboard/overview`);
  };

  return (
    <div className={styles['overview-edit']}>
      <div className={styles['overview-edit__content']}>
        <ProjectImageUpload project={project} />
        <div className={styles['overview-edit__form']}>
          <p
            className={`
                ${styles['overview-edit__status']} 
                ${
                  project.status === 'active'
                    ? styles['overview-edit__status--active']
                    : styles['overview-edit__status--done']
                }
            `}
          >
            {project.status === 'active'
              ? tStatus('active')
              : tStatus('completed')}
          </p>
          <EditProjectForm project={project} />
          <div className={styles['overview-edit__team']}>
            <div className={styles['overview-edit__members']}>
              <Image
                src="/images/users-2.svg"
                alt="users"
                width={24}
                height={24}
              />
              <span className={styles['overview-edit__team-text']}>
                {membersPipe(project.participantsCount, tProjectsPage)}
              </span>
            </div>
            <span className={styles['overview-edit__team-text']}>
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
      <div className={styles['overview-edit__actions']}>
        <Button
          color="green"
          variant="secondary-frame"
          onClick={cancelEditProject}
        >
          {tButtons('cancel')}
        </Button>
        <Button color="green" type="submit" form="edit-project">
          {tButtons('save')}
        </Button>
      </div>
    </div>
  );
}
