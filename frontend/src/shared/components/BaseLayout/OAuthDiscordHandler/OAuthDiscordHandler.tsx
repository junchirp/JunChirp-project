'use client';

import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/routing';
import { useToast } from '@/hooks/useToast';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { fetchNewCsrfToken } from '@/api/csrf';

export default function OAuthDiscordHandler(): null {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const t = useTranslations('discord');
  const handledRef = useRef(false);

  useEffect(() => {
    const handleDiscordOAuth = async (): Promise<void> => {
      if (handledRef.current) {
        return;
      }

      const social = params.get('social');
      const status = params.get('status');

      if (social !== 'discord') {
        return;
      }

      if (status === 'success') {
        await fetchNewCsrfToken();

        showToast({
          severity: 'success',
          summary: t('success'),
          life: 3000,
          actionKey: ToastKeysEnum.DISCORD,
        });
      }

      if (status === 'failure') {
        showToast({
          severity: 'error',
          summary: t('error'),
          detail: t('errorDetails'),
          life: 3000,
          actionKey: ToastKeysEnum.DISCORD,
        });
      }

      handledRef.current = true;

      const newParams = new URLSearchParams(params.toString());
      newParams.delete('social');
      newParams.delete('status');
      newParams.delete('error');
      const newQuery = newParams.toString();

      router.replace(newQuery ? `${pathname}?${newQuery}` : pathname);
    };

    void handleDiscordOAuth();
  }, [params, pathname, router, showToast, t]);

  return null;
}
