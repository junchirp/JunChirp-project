'use client';

import { ReactElement, useState } from 'react';
import styles from './MyProjects.module.scss';
import Button from '@/shared/components/Button/Button';
import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import DiscordBanner from '@/shared/components/DiscordBanner/DiscordBanner';
import { useRouter } from '@/i18n/routing';
import Plus from '@/assets/icons/plus.svg';
import { useTranslations } from 'next-intl';
import { useLazyGetProjectsCountQuery } from '@/api/authApi';
import { ToastKeysEnum } from '@/shared/enums/toast-keys.enum';
import { useToast } from '@/hooks/useToast';
import ProjectCardSmall from '@/shared/components/ProjectCardSmall/ProjectCardSmall';
import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';

interface MyProjectsProps {
  myProjects: ProjectCardInterface[];
  user: AuthInterface;
  invites: ProjectParticipationInterface[];
  requests: ProjectParticipationInterface[];
}

export default function MyProjects({
  myProjects,
  user,
  invites,
  requests,
}: MyProjectsProps): ReactElement {
  const [isBanner, setBanner] = useState(false);
  const router = useRouter();
  const tProjects = useTranslations('projectsPage');
  const tForms = useTranslations('forms.projectForm');
  const [getProjectsCount, { isFetching }] = useLazyGetProjectsCountQuery();
  const { showToast, isActive } = useToast();

  const handleClick = async (): Promise<void> => {
    if (isActive(ToastKeysEnum.NEW_PROJECT)) {
      return;
    }

    if (user.discordId) {
      try {
        const result = await getProjectsCount(undefined, true).unwrap();

        if (result.count >= 2) {
          showToast({
            severity: 'error',
            summary: tForms('error'),
            life: 3000,
            actionKey: ToastKeysEnum.NEW_PROJECT,
          });
        } else {
          router.push('/new-project');
        }
      } catch {
        return;
      }
    } else {
      setBanner(true);
    }
  };

  const closeBanner = (): void => {
    setBanner(false);
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
                  invites={invites}
                  requests={requests}
                  user={user}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {isBanner && (
        <DiscordBanner closeBanner={closeBanner} isCancelButton withWrapper />
      )}
    </>
  );
}
