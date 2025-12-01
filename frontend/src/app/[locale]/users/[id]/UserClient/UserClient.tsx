'use client';

import { ReactElement, useState } from 'react';
import AuthGuard from '@/shared/components/AuthGuard/AuthGuard';
import styles from './UserClient.module.scss';
import Button from '@/shared/components/Button/Button';
import ArrowUpRight from '@/assets/icons/arrow-up-right.svg';
import UserBaseInfo from './UserBaseInfo/UserBaseInfo';
import { useParams } from 'next/navigation';
import { usePathname } from '@/i18n/routing';
import {
  useGetInvitesInMyProjectsQuery,
  useGetMyProjectsQuery,
  useGetRequestsInMyProjectsQuery,
  useGetUserByIdQuery,
  useGetUserProjectsQuery,
} from '@/api/usersApi';
import UserDetails from './UserDetails/UserDetails';
import UserSkeleton from './UserSkeleton/UserSkeleton';
import Page404 from '@/shared/components/Page404/Page404';
import ProjectsCount from './ProjectsCount/ProjectsCount';
import UserProjectsList from './UserProjectsList/UserProjectsList';
import InvitePopup from '@/shared/components/InvitePopup/InvitePopup';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import UserRequests from './UserRequests/UserRequests';
import DataContainer from '@/shared/components/DataContainer/DataContainer';
import { useTranslations } from 'next-intl';
import UserInvites from './UserInvites/UserInvites';

export default function UserClient(): ReactElement {
  const params = useParams();
  const pathname = usePathname();
  const userId = params.id as string;
  const authUser = useAppSelector(authSelector.selectUser);
  const isAuthUser = userId === authUser?.id;
  const [projectsFilter, setProjectsFilter] = useState<
    null | 'active' | 'done'
  >(null);
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
  const { data: invites = [], isLoading: invitesLoading } =
    useGetInvitesInMyProjectsQuery(userId);
  const isLoading =
    projectsLoading || userLoading || requestsLoading || invitesLoading;
  const usersActiveProjects = list?.projects ?? [];
  const usersActiveProjectsWithMeOwner = usersActiveProjects.filter(
    (project) => project.ownerId === authUser?.id,
  );

  const isButtonVisible =
    myProjects.length !== 0 &&
    myProjects.length !==
      requests.length +
        usersActiveProjectsWithMeOwner.length +
        invites.length &&
    user &&
    user.activeProjectsCount < 2;

  const closeModal = (): void => setModalOpen(false);
  const openModal = (): void => setModalOpen(true);

  const toggleFilter = (newFilter: 'active' | 'done'): void => {
    setProjectsFilter((prev) => (prev === newFilter ? null : newFilter));
  };

  const t = useTranslations('profile');

  return (
    <AuthGuard
      requireVerified
      redirectTo={`/auth/login?next=${encodeURIComponent(pathname)}`}
    >
      {isLoading ? (
        <UserSkeleton />
      ) : user ? (
        <>
          <div className={styles['user-client']}>
            <div className={styles['user-client__info']}>
              <UserBaseInfo user={user} />
              <div className={styles['user-client__details']}>
                <UserDetails
                  title={t('educations')}
                  items={user.educations}
                  columnsCount={1}
                />
                <UserDetails title={t('hardSkills')} items={user.hardSkills} />
                <UserDetails
                  title={t('contacts')}
                  items={[
                    { email: user.email, id: user.email },
                    ...user.socials,
                  ]}
                  columnsCount={1}
                />
                <UserDetails title={t('softSkills')} items={user.softSkills} />
              </div>
              <div className={styles['user-client__projects']}>
                <DataContainer title={t('projects')} />
                <ProjectsCount
                  status="active"
                  count={user.activeProjectsCount}
                  active={projectsFilter === 'active'}
                  onClick={() => toggleFilter('active')}
                />
                <ProjectsCount
                  status="done"
                  count={user.doneProjectsCount}
                  active={projectsFilter === 'done'}
                  onClick={() => toggleFilter('done')}
                />
                <UserProjectsList userId={user.id} filter={projectsFilter} />
              </div>
            </div>
            {!isAuthUser && requests.length !== 0 && (
              <UserRequests requests={requests} user={user} />
            )}
            {!isAuthUser && invites.length !== 0 && (
              <UserInvites invites={invites} user={user} />
            )}
            {!isAuthUser && isButtonVisible && (
              <div className={styles['user-client__actions']}>
                <Button
                  size="lg"
                  color="green"
                  iconPosition="right"
                  icon={<ArrowUpRight />}
                  onClick={openModal}
                >
                  {t('inviteBtn')}
                </Button>
              </div>
            )}
          </div>
          {!isAuthUser && isModalOpen && (
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
