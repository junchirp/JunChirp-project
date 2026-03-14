'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';

export default function Auth(): null {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/login');
  }, [router]);

  return null;
}
