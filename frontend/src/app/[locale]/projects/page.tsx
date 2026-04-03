import { ReactElement } from 'react';
import ProjectsClient from './ProjectsClient/ProjectsClient';
import AccessGuard from '@/shared/components/AccessGuard/AccessGuard';

export default function Projects(): ReactElement {
  return (
    <AccessGuard mode="verified">
      <ProjectsClient />
    </AccessGuard>
  );
}
