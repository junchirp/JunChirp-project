'use client';

import { useLocale } from 'next-intl';
import { Locale } from '@/i18n/routing';
import { ShortLocaleType } from '@/shared/types/short-locale.type';
import { localeMap } from '@/shared/constants/locale-map';

export const useShortLocale = (): ShortLocaleType => {
  const locale = useLocale();
  return localeMap[locale as Locale];
};
