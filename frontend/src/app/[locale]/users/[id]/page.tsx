import { ReactElement } from 'react';
import UserClient from './UserClient/UserClient';
import AccessGuard from '@/shared/components/AccessGuard/AccessGuard';

export default function User(): ReactElement {
  return (
    <AccessGuard mode="verified">
      <UserClient />
    </AccessGuard>
  );
}
