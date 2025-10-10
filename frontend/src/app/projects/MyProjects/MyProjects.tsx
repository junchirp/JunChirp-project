'use client';

import { ReactElement, useState } from 'react';
import styles from './MyProjects.module.scss';
import Button from '../../../shared/components/Button/Button';
import UserProjectCard from '../../../shared/components/UserProjectCard/UserProjectCard';
import { ProjectCardInterface } from '../../../shared/interfaces/project-card.interface';
import { UserInterface } from '../../../shared/interfaces/user.interface';
import DiscordBanner from '../../../shared/components/DiscordBanner/DiscordBanner';
import { useRouter } from 'next/navigation';
import Plus from '@/assets/icons/plus.svg';

interface MyProjectsProps {
  myProjects: ProjectCardInterface[];
  user: UserInterface | null;
}

export default function MyProjects({
  myProjects,
  user,
}: MyProjectsProps): ReactElement {
  const [isBanner, setBanner] = useState(false);
  const router = useRouter();

  const handleClick = (): void => {
    if (user?.discordId) {
      router.push('/new-project');
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
        <h3 className={styles['my-projects__title']}>Мої проєкти</h3>
        <div className={styles['my-projects__list-wrapper']}>
          <Button
            className={styles['my-projects__button']}
            color="green"
            iconPosition="right"
            icon={<Plus />}
            onClick={handleClick}
          >
            Створити проєкт
          </Button>
          {!!myProjects.length && (
            <div className={styles['my-projects__list']}>
              {myProjects.map((project) => (
                <UserProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
      {isBanner && (
        <DiscordBanner
          closeBanner={closeBanner}
          message="Щоб створити проєкт, підключи свій Discord. Це потрібно для створення чату проєкту."
          isCancelButton
          withWrapper
        />
      )}
    </>
  );
}
