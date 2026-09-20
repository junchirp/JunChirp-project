import { ReactElement, ReactNode } from 'react';
import AccessGuard from '@/shared/components/AccessGuard/AccessGuard';
import { useProjectAccessCheck } from '@/hooks/useProjectAccessCheck';
import DashboardContent from './DashboardContent/DashboardContent';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <AccessGuard mode="member" checkDataAccess={useProjectAccessCheck}>
      <DashboardContent>{children}</DashboardContent>
    </AccessGuard>
  );
}
