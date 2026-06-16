import { Locale } from '@/i18n/routing';
import { SystemLocaleType } from '@/shared/types/system-locale.type';

export const localeMap: Record<Locale, SystemLocaleType> = {
  'en-GB': 'en',
  'uk-UA': 'ua',
} as const;
