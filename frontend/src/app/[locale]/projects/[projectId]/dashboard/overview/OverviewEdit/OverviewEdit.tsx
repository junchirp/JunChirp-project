'use client';

import React, { ReactElement } from 'react';
import styles from './OverviewEdit.module.scss';
import { ProjectInterface } from '@/shared/interfaces/project.interface';
import EditProjectForm from './EditProjectForm/EditProjectForm';
import { useTranslations } from 'next-intl';
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
  const tButtons = useTranslations('buttons');
  const router = useRouter();

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
