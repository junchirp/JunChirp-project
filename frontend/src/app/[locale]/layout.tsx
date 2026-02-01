import { Metadata } from 'next';
import { ReactElement } from 'react';
import { Locale, routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import BaseLayout from '@/shared/components/BaseLayout/BaseLayout';

export function generateStaticParams(): { locale: Locale }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL('https://junchirp-ugdf.onrender.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
  title: 'JunChirp',
  description: 'JunChirp platform',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>): Promise<ReactElement> {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  return <BaseLayout locale={locale}>{children}</BaseLayout>;
}
