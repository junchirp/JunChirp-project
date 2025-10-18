import { ReactElement, ReactNode } from 'react';
import styles from './layout.module.scss';
import ProjectTabs from './ProjectTabs/ProjectTabs';
import AccessGuard from '@/shared/components/AccessGuard/AccessGuard';
import { useProjectAccessCheck } from '../../../../hooks/useProjectAccessCheck';

export default function CabLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <AccessGuard checkDataAccess={useProjectAccessCheck}>
      <div className={styles['cab-layout']}>
        <ProjectTabs />
        <div>{children}</div>
      </div>
    </AccessGuard>
  );
}
