'use client';

import { ReactElement } from 'react';
import styles from './ProjectClient.module.scss';
import { useParams } from 'next/navigation';
import Page404 from '@/shared/components/Page404/Page404';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { useGetProjectCardByIdQuery } from '@/api/projectsApi';
import ProjectCardLarge from './ProjectCardLarge/ProjectCardLarge';

export default function ProjectClient(): ReactElement {
  const user = useAppSelector(authSelector.selectRequiredUser);
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading } = useGetProjectCardByIdQuery(projectId);

  return (
    <>
      {isLoading ? (
        <div className={styles['project-client']}>
          <div className={styles['project-client__skeleton']} />
        </div>
      ) : project ? (
        <div className={styles['project-client']}>
          <ProjectCardLarge project={project} user={user} />
        </div>
      ) : (
        <Page404 />
      )}
    </>
  );
}
