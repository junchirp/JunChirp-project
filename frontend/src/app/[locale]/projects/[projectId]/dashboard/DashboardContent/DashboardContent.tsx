'use client';

import { ReactElement, ReactNode } from 'react';
import styles from './DashboardContent.module.scss';
import { useParams } from 'next/navigation';
import ProjectName from '../ProjectName/ProjectName';
import { useGetProjectByIdQuery } from '@/api/projectsApi';
import ProjectTabs from '../ProjectTabs/ProjectTabs';

export default function DashboardContent({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project } = useGetProjectByIdQuery(projectId);

  return (
    <div className={styles['dashboard-content']}>
      <ProjectName projectName={project?.projectName} />
      <ProjectTabs project={project} />
      <div>{children}</div>
    </div>
  );
}
