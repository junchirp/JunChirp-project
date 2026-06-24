'use client';

import { ReactElement } from 'react';
import styles from './UsersClient.module.scss';
import Image from 'next/image';
import UsersFilters from './UsersFilters/UsersFilters';
import UsersList from './UsersList/UsersList';
import { useUsersFilters } from '@/hooks/useUsersFilters';
import { useGetMyProjectsQuery, useGetUsersQuery } from '@/api/usersApi';
import ListSkeleton from '@/shared/components/ListSkeleton/ListSkeleton';
import Pagination from '@/shared/components/Pagination/Pagination';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { useTranslations } from 'next-intl';
import {
  useGetInvitesInMyProjectsQuery,
  useGetRequestsInMyProjectsQuery,
} from '@/api/participationsApi';

export default function UsersClient(): ReactElement {
  const { filters, updateFilters } = useUsersFilters();
  const user = useAppSelector(authSelector.selectRequiredUser);
  const t = useTranslations('usersPage');
  const { data: usersList, isLoading: usersLoading } = useGetUsersQuery(
    filters,
    { refetchOnMountOrArgChange: true },
  );
  const { data: myProjectsList, isLoading: myProjectsLoading } =
    useGetMyProjectsQuery(user.id);
  const myProjects =
    myProjectsList?.projects.filter((project) => project.ownerId === user.id) ??
    [];
  const { data: invites = [], isLoading: invitesLoading } =
    useGetInvitesInMyProjectsQuery(user.id);
  const { data: requests = [], isLoading: requestsLoading } =
    useGetRequestsInMyProjectsQuery(user.id);
  const isLoading =
    usersLoading || myProjectsLoading || invitesLoading || requestsLoading;

  const onPageChange = (page: number): void => {
    updateFilters({ page });
  };

  return (
    <div className={styles['users-client']}>
      <div className={styles['users-client__banner']}>
        <Image
          className={`${styles['users-client__image']} ${styles['users-client__image--first']}`}
          src="/images/star.svg"
          alt="star"
          width={33}
          height={35}
        />
        <h2 className={styles['users-client__title']}>{t('bannerName')}</h2>
        <Image
          className={`${styles['users-client__image']} ${styles['users-client__image--last']}`}
          src="/images/star.svg"
          alt="star"
          width={33}
          height={35}
        />
      </div>
      <div className={styles['users-client__container']}>
        <UsersFilters />
        {isLoading ? (
          <ListSkeleton itemHeight={288} rows={10} />
        ) : usersList?.users.length ? (
          <UsersList
            users={usersList.users}
            myProjects={myProjects}
            invites={invites}
            requests={requests}
          />
        ) : null}
        {!!usersList?.users.length && (
          <Pagination
            total={usersList.total}
            limit={filters.limit}
            page={filters.page}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
}
