'use client';

import { Locale } from '@/i18n/routing';
import { useLocale } from 'next-intl';

const localeMap = {
  en: 'en-GB',
  ua: 'uk-UA',
} as const;

export const useDateFormatter = () => {
  const locale = useLocale();

  return (date: Date): string =>
    new Intl.DateTimeFormat(localeMap[locale as Locale], {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
};
