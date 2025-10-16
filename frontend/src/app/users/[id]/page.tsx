'use client';

import { ReactElement, useEffect, useState } from 'react';
import AuthGuard from '@/shared/components/AuthGuard/AuthGuard';
import styles from './page.module.scss';
import Button from '@/shared/components/Button/Button';
import ArrowUpRight from '@/assets/icons/arrow-up-right.svg';
import UserBaseInfo from './UserBaseInfo/UserBaseInfo';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  useGetMyProjectsQuery,
  useGetRequestsInMyProjectsQuery,
  useGetUserByIdQuery,
  useGetUserProjectsQuery,
} from '@/api/usersApi';
import UserDetails from '@/app/users/[id]/UserDetails/UserDetails';
import UserSkeleton from '@/app/users/[id]/UserSkeleton/UserSkeleton';
import Page404 from '@/shared/components/Page404/Page404';
import ProjectsCount from './ProjectsCount/ProjectsCount';
import UserProjectsList from './UserProjectsList/UserProjectsList';
import InvitePopup from '@/shared/components/InvitePopup/InvitePopup';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import UserRequests from './UserRequests/UserRequests';
import { setUserPageId } from '@/redux/ui/uiSlice';

export default function User(): ReactElement | null {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const userId = params.id as string;
  const authUser = useAppSelector(authSelector.selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (authUser?.id && authUser.id === userId) {
      router.replace('/profile');
    }
  }, [authUser?.id, userId, router]);

  useEffect(() => {
    dispatch(setUserPageId(userId));
  }, [userId, dispatch]);

  if (authUser?.id === userId) {
    return null;
  }

  const [isModalOpen, setModalOpen] = useState(false);
  const { data: user, isLoading: userLoading } = useGetUserByIdQuery(userId);

  const { data: myProjectsList } = useGetMyProjectsQuery(
    authUser ? { userId: authUser.id } : undefined,
    { skip: !authUser },
  );
  const myProjects =
    myProjectsList?.projects.filter(
      (project) => project.ownerId === authUser?.id,
    ) ?? [];
  const { data: list, isLoading: projectsLoading } = useGetUserProjectsQuery({
    id: userId,
    params: {
      page: 1,
      limit: 5,
      status: 'active',
    },
  });
  const { data: requests = [], isLoading: requestsLoading } =
    useGetRequestsInMyProjectsQuery(userId);
  const isLoading = projectsLoading || userLoading || requestsLoading;
  const usersActiveProjects = list?.projects ?? [];
  const usersActiveProjectsWithMeOwner = usersActiveProjects.filter(
    (project) => project.ownerId === authUser?.id,
  );

  const isButtonVisible =
    myProjects.length !== 0 &&
    myProjects.length !==
      requests.length + usersActiveProjectsWithMeOwner.length &&
    user &&
    user.activeProjectsCount < 2;

  const closeModal = (): void => setModalOpen(false);
  const openModal = (): void => setModalOpen(true);

  return (
    <AuthGuard
      requireVerified
      redirectTo={`/auth/login?next=${encodeURIComponent(pathname)}`}
    >
      {isLoading ? (
        <UserSkeleton />
      ) : user ? (
        <>
          <div className={styles.user}>
            <div className={styles.user__info}>
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
                  items={[
                    { email: user.email, id: user.email },
                    ...user.socials,
                  ]}
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
                <ProjectsCount
                  status="active"
                  count={user.activeProjectsCount}
                />
                <ProjectsCount status="done" count={user.doneProjectsCount} />
                <UserProjectsList userId={user.id} />
              </div>
            </div>
            {requests.length !== 0 && (
              <UserRequests requests={requests} user={user} />
            )}
            {isButtonVisible && (
              <div className={styles.user__actions}>
                <Button
                  size="lg"
                  color="green"
                  iconPosition="right"
                  icon={<ArrowUpRight />}
                  onClick={openModal}
                >
                  Запросити в проєкт
                </Button>
              </div>
            )}
          </div>
          {isModalOpen && (
            <InvitePopup
              onClose={closeModal}
              user={user}
              myProjects={myProjects}
            />
          )}
        </>
      ) : (
        <Page404 />
      )}
    </AuthGuard>
  );
}
