'use client';

import { ReactElement } from 'react';
import styles from './MyProjects.module.scss';
import Button from '@/shared/components/Button/Button';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import { useRouter } from '@/i18n/routing';
import Plus from '@/assets/icons/plus.svg';
import { useTranslations } from 'next-intl';
import { useLazyGetProjectsCountQuery } from '@/api/authApi';
import { useLazyCheckDiscordQuery } from '@/api/discordApi';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { useToast } from '@/hooks/useToast';
import ProjectCardSmall from '@/shared/components/ProjectCardSmall/ProjectCardSmall';
import { ProjectCardExpandedInterface } from '@/shared/interfaces/project-card-expanded.interface';
import { useDiscord } from '@/hooks/useDiscord';
import { isDiscordNotConnectedError } from '@/shared/utils/isDiscordNotConnectedError';
import { isDiscordNotInGuildError } from '@/shared/utils/isDiscordNotInGuildError';

interface MyProjectsProps {
  myProjects: ProjectCardExpandedInterface[];
  user: AuthInterface;
}

export default function MyProjects({
  myProjects,
  user,
}: MyProjectsProps): ReactElement {
  const [checkDiscord] = useLazyCheckDiscordQuery();
  const openDiscordConnect = useDiscord();
  const router = useRouter();
  const tProjects = useTranslations('projectsPage');
  const tForms = useTranslations('forms.projectForm');
  const [getProjectsCount, { isFetching }] = useLazyGetProjectsCountQuery();
  const { showToast, isActive } = useToast();

  const handleClick = async (): Promise<void> => {
    if (isActive(ToastKeysEnum.NEW_PROJECT)) {
      return;
    }

    try {
      await checkDiscord().unwrap();

      const result = await getProjectsCount().unwrap();

      if (result.count >= 2) {
        showToast({
          severity: 'error',
          summary: tForms('error'),
          life: 3000,
          actionKey: ToastKeysEnum.NEW_PROJECT,
        });

        return;
      }

      router.push('/new-project');
    } catch (error) {
      if (isDiscordNotConnectedError(error)) {
        if (isDiscordNotConnectedError(error)) {
          openDiscordConnect({
            withWrapper: false,
            isCancelButton: false,
            errorCode: 'DISCORD_NOT_CONNECTED',
          });
        }

        if (isDiscordNotInGuildError(error)) {
          openDiscordConnect({
            withWrapper: false,
            isCancelButton: false,
            errorCode: 'DISCORD_NOT_IN_GUILD',
          });
        }
      }
    }
  };

  return (
    <>
      <div className={styles['my-projects']}>
        <h3 className={styles['my-projects__title']}>
          {tProjects('myProjects')}
        </h3>
        <div className={styles['my-projects__list-wrapper']}>
          <Button
            className={styles['my-projects__button']}
            color="green"
            loading={isFetching}
            iconPosition="right"
            icon={<Plus />}
            onClick={handleClick}
          >
            {tProjects('createProject')}
          </Button>
          {!!myProjects.length && user && (
            <div className={styles['my-projects__list']}>
              {myProjects.map((project) => (
                <ProjectCardSmall
                  key={project.id}
                  project={project}
                  user={user}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
