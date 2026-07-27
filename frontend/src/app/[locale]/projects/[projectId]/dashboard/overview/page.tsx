'use client';

import { ReactElement, useEffect } from 'react';
import styles from './page.module.scss';
import { useParams, useSearchParams } from 'next/navigation';
import { useGetProjectByIdQuery } from '@/api/projectsApi';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import OverviewEdit from './OverviewEdit/OverviewEdit';
import OverviewView from './OverviewView/OverviewView';
import { useRouter } from '@/i18n/routing';

export default function Overview(): ReactElement {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project } = useGetProjectByIdQuery(projectId);
  const user = useAppSelector(authSelector.selectRequiredUser);
  const searchParams = useSearchParams();
  const isEdit = searchParams.get('mode') === 'edit';
  const router = useRouter();

  const isOwner = project?.ownerId === user.id;

  useEffect(() => {
    if (project && isEdit && !isOwner) {
      router.replace(`/projects/${projectId}/dashboard/overview`);
    }
  }, [project, isEdit, router, isOwner, projectId]);

  if (!project) {
    return (
      <div className={styles.overview}>
        <div className={styles.overview__image} />
        <div className={styles.overview__description} />
      </div>
    );
  }

  return (
    <>
      {isEdit ? (
        <OverviewEdit project={project} />
      ) : (
        <OverviewView project={project} isOwner={isOwner} />
      )}
    </>
  );
}
