import { Locale } from '@/i18n/routing';
import { ShortLocaleType } from '@/shared/types/short-locale.type';

export const localeMap: Record<Locale, ShortLocaleType> = {
  'en-GB': 'en',
  'uk-UA': 'ua',
} as const;
