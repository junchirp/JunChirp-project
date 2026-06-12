'use client';

import { ReactElement } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { useParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/routing';
import Button from '@/shared/components/Button/Button';
import styles from './ProjectTabs.module.scss';
import Arrow from '@/assets/icons/arrow-up-right.svg';
import { useTranslations } from 'next-intl';

export default function ProjectTabs(): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams<{ id: string }>();
  const t = useTranslations('dashboardMenu');

  const basePath = `/projects/${id}/dashboard`;

  const activeIndex = pathname.includes('/overview')
    ? 0
    : pathname.endsWith('/docs')
      ? 1
      : pathname.endsWith('/team')
        ? 2
        : pathname.endsWith('/boards')
          ? 3
          : 0;

  const items = [
    {
      label: t('info'),
      disabled: activeIndex === 0,
      command: (): void => {
        router.push(`${basePath}/overview`);
      },
    },
    {
      label: t('docs'),
      disabled: activeIndex === 1,
      command: (): void => {
        router.push(`${basePath}/docs`);
      },
    },
    {
      label: t('members'),
      disabled: activeIndex === 2,
      command: (): void => {
        router.push(`${basePath}/team`);
      },
    },
    {
      label: t('boards'),
      disabled: activeIndex === 3,
      command: (): void => {
        router.push(`${basePath}/boards`);
      },
    },
  ];

  return (
    <div className={styles['project-tabs']}>
      <TabMenu
        className={'project-tabs__menu'}
        model={items}
        activeIndex={activeIndex}
      />
      <Button color="green" size="md" iconPosition="right" icon={<Arrow />}>
        {t('chat')}
      </Button>
    </div>
  );
}
