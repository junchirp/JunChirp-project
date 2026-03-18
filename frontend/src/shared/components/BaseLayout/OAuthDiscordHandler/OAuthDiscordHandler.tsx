'use client';

import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/routing';
import { useToast } from '@/hooks/useToast';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function OAuthDiscordHandler(): null {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const t = useTranslations('discord');

  useEffect(() => {
    const social = params.get('social');
    const status = params.get('status');

    if (social !== 'discord') {
      return;
    }

    if (status === 'success') {
      showToast({
        severity: 'success',
        summary: t('success'),
        life: 3000,
        actionKey: 'discord',
      });
    }

    if (status === 'failure') {
      showToast({
        severity: 'error',
        summary: t('error'),
        detail: t('errorDetails'),
        life: 3000,
        actionKey: 'discord',
      });
    }

    router.replace(pathname);
  }, [params, pathname, router, showToast]);

  return null;
}
