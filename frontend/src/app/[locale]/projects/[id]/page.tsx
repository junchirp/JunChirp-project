import { ReactElement } from 'react';
import AccessGuard from '@/shared/components/AccessGuard/AccessGuard';
import { useProjectCardAccessCheck } from '@/hooks/useProjecCardAccessCheck';
import ProjectClient from './ProjectClient/ProjectClient';

export default function Project(): ReactElement {
  return (
    <AccessGuard mode="no-member" checkDataAccess={useProjectCardAccessCheck}>
      <ProjectClient />
    </AccessGuard>
  );
}
