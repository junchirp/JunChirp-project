import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en-GB', 'uk-UA'],
  defaultLocale: 'uk-UA',
  localePrefix: {
    mode: 'as-needed',
    prefixes: {
      'en-GB': '/en',
      'uk-UA': '/ua',
    },
  },
  localeCookie: true,
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
