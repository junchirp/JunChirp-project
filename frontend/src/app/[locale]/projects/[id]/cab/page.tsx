'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function Cab(): null {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    router.push(`/projects/${id}/cab/info`);
  }, [router]);

  return null;
}
