'use client';

import React, { ReactElement } from 'react';
import styles from './ProjectInfoEdit.module.scss';
import { ProjectInterface } from '@/shared/interfaces/project.interface';
import EditProjectForm from './EditProjectForm/EditProjectForm';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import { membersPipe } from '@/shared/utils/membersPipe';
import Button from '@/shared/components/Button/Button';
import { useRouter } from '@/i18n/routing';
import ProjectImageUpload from './ProjectImageUpload/ProjectImageUpload';

interface ProjectInfoEditProps {
  project: ProjectInterface;
}

export default function ProjectInfoEdit({
  project,
}: ProjectInfoEditProps): ReactElement {
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
    router.replace(`/projects/${project.id}/dashboard/info`);
  };

  return (
    <div className={styles['project-info-edit']}>
      <div className={styles['project-info-edit__content']}>
        <ProjectImageUpload project={project} />
        <div className={styles['project-info-edit__form']}>
          <p
            className={`
                ${styles['project-info-edit__status']} 
                ${
                  project.status === 'active'
                    ? styles['project-info-edit__status--active']
                    : styles['project-info-edit__status--done']
                }
            `}
          >
            {project.status === 'active'
              ? tStatus('active')
              : tStatus('completed')}
          </p>
          <EditProjectForm project={project} />
          <div className={styles['project-info-edit__team']}>
            <div className={styles['project-info-edit__members']}>
              <Image
                src="/images/users-2.svg"
                alt="users"
                width={24}
                height={24}
              />
              <span className={styles['project-info-edit__team-text']}>
                {membersPipe(project.participantsCount, tProjectsPage)}
              </span>
            </div>
            <span className={styles['project-info-edit__team-text']}>
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
      <div className={styles['project-info-edit__actions']}>
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
