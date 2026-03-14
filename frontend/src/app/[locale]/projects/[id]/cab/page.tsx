'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';

export default function Cab(): null {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    router.replace(`/projects/${id}/cab/info`);
  }, [router]);

  return null;
}
