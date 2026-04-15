'use client';

import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { SocialProviderType } from '@/shared/types/social-provider.type';

export const useOAuthRedirect = (): {
  redirectToOAuth: (provider: SocialProviderType) => void;
} => {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const redirectToOAuth = (provider: SocialProviderType): void => {
    const query = searchParams.toString();
    const currentPath = query ? `${pathname}?${query}` : pathname;
    const returnUrl = encodeURIComponent(currentPath);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_API_URL is not defined');
    }

    window.location.href = `${baseUrl}/auth/${provider}?returnUrl=${returnUrl}&locale=${locale}`;
  };

  return { redirectToOAuth };
};
