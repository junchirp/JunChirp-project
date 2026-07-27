'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';

export default function Dashboard(): null {
  const router = useRouter();
  const { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    router.replace(`/projects/${projectId}/dashboard/overview`);
  }, [router]);

  return null;
}
