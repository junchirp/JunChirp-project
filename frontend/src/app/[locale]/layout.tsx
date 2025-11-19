import { Metadata } from 'next';
import { ReactElement, ReactNode } from 'react';
import { Locale, routing } from '../../i18n/routing';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import BaseLayout from '../../shared/components/BaseLayout/BaseLayout';

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export function generateStaticParams(): { locale: Locale }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
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
}: LocaleLayoutProps): Promise<ReactElement> {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  return <BaseLayout locale={locale}>{children}</BaseLayout>;
}
