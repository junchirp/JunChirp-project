'use client';

import { ReactElement } from 'react';
import { useParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/routing';
import Button from '@/shared/components/Button/Button';
import styles from './ProjectTabs.module.scss';
import Arrow from '@/assets/icons/arrow-up-right.svg';
import { useTranslations } from 'next-intl';
import TabMenu from '@/shared/components/TabMenu/TabMenu';

export default function ProjectTabs(): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const { projectId } = useParams<{ projectId: string }>();
  const t = useTranslations('dashboardMenu');

  const basePath = `/projects/${projectId}/dashboard`;

  const activeIndex = pathname.includes('/overview')
    ? 0
    : pathname.endsWith('/docs')
      ? 1
      : pathname.endsWith('/team')
        ? 2
        : pathname.includes('/boards')
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
      <TabMenu variant="default" model={items} activeIndex={activeIndex} />
      <Button color="green" size="md" iconPosition="right" icon={<Arrow />}>
        {t('chat')}
      </Button>
    </div>
  );
}
