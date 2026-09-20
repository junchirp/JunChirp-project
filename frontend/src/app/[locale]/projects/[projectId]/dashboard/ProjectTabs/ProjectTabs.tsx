'use client';

import { ReactElement } from 'react';
import { useParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/routing';
import Button from '@/shared/components/Button/Button';
import styles from './ProjectTabs.module.scss';
import Arrow from '@/assets/icons/arrow-up-right.svg';
import { useTranslations } from 'next-intl';
import TabMenu from '@/shared/components/TabMenu/TabMenu';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { ProjectInterface } from '@/shared/interfaces/project.interface';
import {
  useLazyCheckDiscordChannelQuery,
  useLazyCheckDiscordQuery,
} from '@/api/discordApi';
import { isDiscordNotConnectedError } from '@/shared/utils/isDiscordNotConnectedError';
import { isDiscordNotInGuildError } from '@/shared/utils/isDiscordNotInGuildError';
import { useDiscord } from '@/hooks/useDiscord';
import { isDiscordChannelNotFoundError } from '@/shared/utils/isDiscordChannelNotFoundError';

interface ProjectTabsProps {
  project: ProjectInterface | undefined;
}

export default function ProjectTabs({
  project,
}: ProjectTabsProps): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const { projectId } = useParams<{ projectId: string }>();
  const user = useAppSelector(authSelector.selectRequiredUser);
  const openDiscordConnect = useDiscord();
  const [checkDiscord] = useLazyCheckDiscordQuery();
  const [checkDiscordChannel] = useLazyCheckDiscordChannelQuery();
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

  const handleClickChat = async (): Promise<void> => {
    if (!project) {
      return;
    }

    try {
      await checkDiscord().unwrap();
    } catch (error) {
      if (isDiscordNotConnectedError(error)) {
        openDiscordConnect({
          withWrapper: true,
          isCancelButton: true,
          errorCode: 'DISCORD_NOT_CONNECTED',
        });
        return;
      }

      if (isDiscordNotInGuildError(error)) {
        openDiscordConnect({
          withWrapper: true,
          isCancelButton: true,
          errorCode: 'DISCORD_NOT_IN_GUILD',
        });
        return;
      }

      return;
    }

    const isOwner = user.id === project.ownerId;

    if (project.status === 'done' && !isOwner) {
      window.open(
        'https://discord.com/channels/1362056776119488755/1362056776744435947',
        '_blank',
      );
      return;
    }

    try {
      await checkDiscordChannel(project.id).unwrap();

      window.open(project.discordUrl, '_blank');
    } catch (error) {
      if (isDiscordChannelNotFoundError(error)) {
        // TODO: show different toast for Project owner and team members
      }
    }
  };

  return (
    <div className={styles['project-tabs']}>
      <TabMenu variant="default" model={items} activeIndex={activeIndex} />
      <Button
        color="green"
        size="md"
        iconPosition="right"
        icon={<Arrow />}
        onClick={handleClickChat}
      >
        {t('chat')}
      </Button>
    </div>
  );
}
