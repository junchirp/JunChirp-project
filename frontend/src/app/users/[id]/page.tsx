'use client';

import { ReactElement, useState } from 'react';
import AuthGuard from '@/shared/components/AuthGuard/AuthGuard';
import styles from './page.module.scss';
import Button from '@/shared/components/Button/Button';
import ArrowUpRight from '@/assets/icons/arrow-up-right.svg';
import UserBaseInfo from './UserBaseInfo/UserBaseInfo';
import { useParams, usePathname } from 'next/navigation';
import { useGetMyProjectsQuery, useGetUserByIdQuery } from '@/api/usersApi';
import UserDetails from '@/app/users/[id]/UserDetails/UserDetails';
import UserSkeleton from '@/app/users/[id]/UserSkeleton/UserSkeleton';
import Page404 from '../../../shared/components/Page404/Page404';
import ProjectsCount from './ProjectsCount/ProjectsCount';
import UserProjectsList from './UserProjectsList/UserProjectsList';
import InvitePopup from '../../../shared/components/InvitePopup/InvitePopup';
import { useAppSelector } from '../../../hooks/reduxHooks';
import authSelector from '../../../redux/auth/authSelector';

export default function User(): ReactElement {
  const params = useParams();
  const pathname = usePathname();
  const userId = params.id as string;
  const [isModalOpen, setModalOpen] = useState(false);
  const { data: user, isLoading } = useGetUserByIdQuery(userId);
  const authUser = useAppSelector(authSelector.selectUser);
  const { data: myProjectsList } = useGetMyProjectsQuery(
    authUser ? { userId: authUser.id } : undefined,
    { skip: !authUser },
  );
  const myProjects =
    myProjectsList?.projects.filter(
      (project) => project.ownerId === authUser?.id,
    ) ?? [];

  const closeModal = (): void => setModalOpen(false);
  const openModal = (): void => setModalOpen(true);

  if (isLoading) {
    return <UserSkeleton />;
  } else if (user) {
    return (
      <AuthGuard
        requireVerified
        redirectTo={`/auth/login?next=${encodeURIComponent(pathname)}`}
      >
        <div className={styles.user}>
          <UserBaseInfo user={user} />
          <div className={styles.user__details}>
            <UserDetails
              title="Освіта"
              items={user.educations}
              columnsCount={1}
            />
            <UserDetails title="Hard Skills" items={user.hardSkills} />
            <UserDetails
              title="Контактні дані"
              items={[{ email: user.email, id: user.email }, ...user.socials]}
              columnsCount={1}
            />
            <UserDetails title="Soft Skills" items={user.softSkills} />
          </div>
          <div className={styles.user__projects}>
            <UserDetails
              title="Проєкти користувача"
              items={[]}
              columnsCount={1}
            />
            <ProjectsCount status="active" count={user.activeProjectsCount} />
            <ProjectsCount status="done" count={user.doneProjectsCount} />
            <UserProjectsList userId={user.id} />
          </div>
          <div className={styles.user__actions}>
            <Button
              size="lg"
              color="green"
              iconPosition="right"
              icon={<ArrowUpRight />}
              onClick={openModal}
              disabled={
                user.activeProjectsCount === 2 ||
                myProjectsList?.projects.length === 0
              }
            >
              Запросити в проєкт
            </Button>
          </div>
        </div>
        {isModalOpen && (
          <InvitePopup
            onClose={closeModal}
            user={user}
            myProjects={myProjects}
          />
        )}
      </AuthGuard>
    );
  } else {
    return <Page404 />;
  }
}
