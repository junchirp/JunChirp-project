'use client';

import { ReactElement } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Button from '../../../../../shared/components/Button/Button';
import styles from './ProjectTabs.module.scss';
import Arrow from '@/assets/icons/arrow-up-right.svg';

export default function ProjectTabs(): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams<{ id: string }>();

  const basePath = `/projects/${id}/cab`;
  const items = [
    {
      label: 'Загальна інформація',
      // command: (): void => router.push(`${basePath}/info`),
    },
    {
      label: 'Документація',
      // command: (): void => router.push(`${basePath}/docs`),
    },
    {
      label: 'Список учасників',
      // command: (): void => router.push(`${basePath}/members`),
    },
    {
      label: 'Дошка завдань',
      // command: (): void => router.push(`${basePath}/boards`),
    },
  ];

  const activeIndex = pathname.endsWith('/info')
    ? 0
    : pathname.endsWith('/docs')
      ? 1
      : pathname.endsWith('/members')
        ? 2
        : pathname.endsWith('/boards')
          ? 3
          : 0;

  return (
    <>
      <div className={styles['project-tabs']}>
        <TabMenu
          className={'project-tabs__menu-1'}
          model={items}
          activeIndex={activeIndex}
        />
        <Button color="green" size="md" iconPosition="right" icon={<Arrow/>}>
          Чат
        </Button>
      </div>
      <div className={styles['project-tabs']}>
        <TabMenu
          className={'project-tabs__menu-2'}
          model={items}
          activeIndex={activeIndex}
        />
        <Button color="green" size="md" iconPosition="right" icon={<Arrow/>}>
          Чат
        </Button>
      </div>
      <div className={styles['project-tabs']}>
        <TabMenu
          className={'project-tabs__menu-3'}
          model={items}
          activeIndex={activeIndex}
        />
        <Button color="green" size="md" iconPosition="right" icon={<Arrow/>}>
          Чат
        </Button>
      </div>
      <div className={styles['project-tabs']}>
        <TabMenu
          className={'project-tabs__menu-4'}
          model={items}
          activeIndex={activeIndex}
        />
        <Button color="green" size="md" iconPosition="right" icon={<Arrow/>}>
          Чат
        </Button>
      </div>
      <div className={styles['project-tabs']}>
        <TabMenu
          className={'project-tabs__menu-5'}
          model={items}
          activeIndex={activeIndex}
        />
        <Button color="green" size="md" iconPosition="right" icon={<Arrow/>}>
          Чат
        </Button>
      </div>
      <div className={styles['project-tabs']}>
        <TabMenu
          className={'project-tabs__menu-6'}
          model={items}
          activeIndex={activeIndex}
        />
        <Button color="green" size="md" iconPosition="right" icon={<Arrow/>}>
          Чат
        </Button>
      </div>
    </>
  );
}
