import { ReactElement } from 'react';
import ProfileClient from './ProfileClient/ProfileClient';
import AccessGuard from '@/shared/components/AccessGuard/AccessGuard';

export default function Profile(): ReactElement {
  return (
    <AccessGuard mode="verified">
      <ProfileClient />
    </AccessGuard>
  );
}
