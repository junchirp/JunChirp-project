'use client';

import { ReactElement, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useGetProjectByIdQuery } from '@/api/projectsApi';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import ProjectInfoEdit from './ProjectInfoEdit/ProjectInfoEdit';
import ProjectInfoView from './ProjectInfoView/ProjectInfoView';
import { useRouter } from '@/i18n/routing';

export default function Info(): ReactElement | null {
  const { id } = useParams<{ id: string }>();
  const { data: project } = useGetProjectByIdQuery(id);
  const user = useAppSelector(authSelector.selectUser);
  const searchParams = useSearchParams();
  const isEdit = searchParams.get('mode') === 'edit';
  const router = useRouter();

  const isOwner = !!project && !!user && project.ownerId === user.id;

  useEffect(() => {
    if (project && user && isEdit && !isOwner) {
      router.replace(`/projects/${id}/dashboard/info`);
    }
  }, [project, user, isEdit, router, isOwner, id]);

  if (!project || !user) {
    return null;
  }

  return (
    <>
      {isEdit ? (
        <ProjectInfoEdit project={project} />
      ) : (
        <ProjectInfoView project={project} isOwner={isOwner} />
      )}
    </>
  );
}
