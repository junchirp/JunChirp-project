import { ReactElement } from 'react';
import HomeClient from '@/app/components/HomeClient/HomeClient';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale,
    namespace: 'meta.home',
  });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      siteName: 'JunChirp',
      locale: locale === 'ua' ? 'uk_UA' : 'en_US',
      type: 'website',
      images:
        locale === 'ua'
          ? ['/images/invitation-banner_ua.jpg']
          : ['/images/invitation-banner_en.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images:
        locale === 'ua'
          ? ['/images/invitation-banner_ua.jpg']
          : ['/images/invitation-banner_en.jpg'],
    },
  };
}

export default function Home(): ReactElement {
  return <HomeClient />;
}
