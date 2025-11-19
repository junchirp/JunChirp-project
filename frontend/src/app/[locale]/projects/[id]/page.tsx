'use client';

import { ReactElement, useEffect } from 'react';
import styles from './page.module.scss';
import { usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import Page404 from '@/shared/components/Page404/Page404';
import AuthGuard from '@/shared/components/AuthGuard/AuthGuard';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { useGetProjectCardByIdQuery } from '@/api/projectsApi';
import { useGetMyInvitesQuery, useGetMyRequestsQuery } from '@/api/usersApi';
import ProjectCard from '@/shared/components/ProjectCard/ProjectCard';

export default function Project(): ReactElement | null {
  const user = useAppSelector(authSelector.selectUser);
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { data: project, isLoading: projectLoading } =
    useGetProjectCardByIdQuery(projectId, { skip: !user });

  const { data: requests = [], isLoading: requestsLoading } =
    useGetMyRequestsQuery(user ? { userId: user.id } : undefined, {
      skip: !user,
    });
  const { data: invites = [], isLoading: invitesLoading } =
    useGetMyInvitesQuery(user ? { userId: user.id } : undefined, {
      skip: !user,
    });
  const pathname = usePathname();
  const isLoading = projectLoading || requestsLoading || invitesLoading;

  useEffect(() => {
    if (!isLoading && project && user) {
      const isParticipant = project.roles?.some(
        (role) => role.user?.id === user.id,
      );

      if (isParticipant) {
        router.push(`/projects/${projectId}/cab`);
      }
    }
  }, [isLoading, project, user, router, projectId]);

  const isParticipant =
    project && user && project.roles?.some((r) => r.user?.id === user.id);

  if (isParticipant) {
    return null;
  }

  return (
    <AuthGuard
      requireVerified
      redirectTo={`/auth/login?next=${encodeURIComponent(pathname)}`}
    >
      {isLoading ? (
        <div className={styles.project}>
          <div className={styles.project__skeleton} />
        </div>
      ) : project ? (
        <div className={styles['project']}>
          <ProjectCard
            project={project}
            invites={invites}
            requests={requests}
            user={user}
            size="large"
          />
        </div>
      ) : (
        <Page404 />
      )}
    </AuthGuard>
  );
}
