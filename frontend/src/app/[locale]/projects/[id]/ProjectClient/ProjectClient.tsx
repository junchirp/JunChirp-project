'use client';

import { ReactElement } from 'react';
import styles from './ProjectClient.module.scss';
import { useParams } from 'next/navigation';
import Page404 from '@/shared/components/Page404/Page404';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { useGetProjectCardByIdQuery } from '@/api/projectsApi';
import { useGetMyInvitesQuery, useGetMyRequestsQuery } from '@/api/usersApi';
import ProjectCardLarge from './ProjectCardLarge/ProjectCardLarge';

export default function ProjectClient(): ReactElement {
  const user = useAppSelector(authSelector.selectRequiredUser);
  const params = useParams();
  const projectId = params.id as string;
  const { data: project, isLoading: projectLoading } =
    useGetProjectCardByIdQuery(projectId);

  const { data: requests = [], isLoading: requestsLoading } =
    useGetMyRequestsQuery(user.id);
  const { data: invites = [], isLoading: invitesLoading } =
    useGetMyInvitesQuery(user.id);
  const isLoading = projectLoading || requestsLoading || invitesLoading;

  return (
    <>
      {isLoading ? (
        <div className={styles['project-client']}>
          <div className={styles['project-client__skeleton']} />
        </div>
      ) : project ? (
        <div className={styles['project-client']}>
          <ProjectCardLarge
            project={project}
            invites={invites}
            requests={requests}
            user={user}
          />
        </div>
      ) : (
        <Page404 />
      )}
    </>
  );
}
