'use client';

import { useLocale } from 'next-intl';
import { Locale } from '@/i18n/routing';
import { SystemLocaleType } from '@/shared/types/system-locale.type';
import { localeMap } from '@/shared/constants/locale-map';

export const useSystemLocale = (): SystemLocaleType => {
  const locale = useLocale();
  return localeMap[locale as Locale];
};
