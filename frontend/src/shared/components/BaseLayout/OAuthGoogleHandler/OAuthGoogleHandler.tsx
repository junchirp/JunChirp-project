'use client';

import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/routing';
import { useToast } from '@/hooks/useToast';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { fetchNewCsrfToken } from '@/api/csrf';

export default function OAuthGoogleHandler(): null {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const loadingStatus = useAppSelector(authSelector.selectLoadingStatus);
  const t = useTranslations('auth');
  const handledRef = useRef(false);

  useEffect(() => {
    const handleOAuth = async (): Promise<void> => {
      if (handledRef.current) {
        return;
      }

      const status = params.get('status');
      const error = params.get('error');
      const authType = params.get('authType');

      if (status === 'success') {
        if (loadingStatus !== 'loaded') {
          return;
        }

        await fetchNewCsrfToken();

        if (authType === 'registration') {
          showToast({
            severity: 'success',
            summary: t('googleSuccess'),
            detail: t('googleSuccessDetails'),
            life: 3000,
            actionKey: ToastKeysEnum.GOOGLE,
          });
        }
      }

      if (error) {
        showToast({
          severity: 'error',
          summary: t('googleError'),
          detail: t('googleErrorDetails'),
          life: 3000,
          actionKey: ToastKeysEnum.GOOGLE,
        });
      }

      handledRef.current = true;

      const newParams = new URLSearchParams(params.toString());
      newParams.delete('social');
      newParams.delete('status');
      newParams.delete('authType');
      newParams.delete('error');
      const newQuery = newParams.toString();

      router.replace(newQuery ? `${pathname}?${newQuery}` : pathname);
    };

    void handleOAuth();
  }, [loadingStatus, params, pathname, router, showToast, t]);

  return null;
}
