'use client';

import { TabMenu } from 'primereact/tabmenu';
import React, { ReactElement } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function TabMenuWrapper(): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('auth');
  const activeIndex = pathname.includes('login') ? 1 : 0;
  const items = [
    {
      label: t('signUp'),
      disabled: activeIndex === 0,
      command: (): void => {
        router.push('/auth/registration');
      },
    },
    {
      label: t('signIn'),
      disabled: activeIndex === 1,
      command: (): void => {
        router.push('/auth/login');
      },
    },
  ];

  return (
    <TabMenu
      className={'tab-menu-wrapper'}
      model={items}
      activeIndex={activeIndex}
    />
  );
}
