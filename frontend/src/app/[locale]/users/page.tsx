import { ReactElement } from 'react';
import AccessGuard from '@/shared/components/AccessGuard/AccessGuard';
import UsersClient from './UsersClient/UsersClient';

export default function Users(): ReactElement {
  return (
    <AccessGuard mode="verified">
      <UsersClient />
    </AccessGuard>
  );
}
