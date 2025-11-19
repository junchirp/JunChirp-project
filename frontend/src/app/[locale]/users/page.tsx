'use client';

import { ReactElement, useEffect } from 'react';
import AuthGuard from '@/shared/components/AuthGuard/AuthGuard';
import styles from './page.module.scss';
import Image from 'next/image';
import UsersFilters from './UsersFilters/UsersFilters';
import UsersList from './UsersList/UsersList';
import { useUsersFilters } from '@/hooks/useUsersFilters';
import { useGetMyProjectsQuery, useGetUsersQuery } from '@/api/usersApi';
import ListSkeleton from '@/shared/components/ListSkeleton/ListSkeleton';
import { useToast } from '@/hooks/useToast';
import Pagination from '@/shared/components/Pagination/Pagination';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';

export default function Users(): ReactElement {
  const { filters, updateFilters } = useUsersFilters();
  const { showToast } = useToast();
  const user = useAppSelector(authSelector.selectUser);

  const onPageChange = (page: number): void => {
    updateFilters({ page });
  };

  const {
    data: usersList,
    isLoading: usersLoading,
    isError,
  } = useGetUsersQuery(filters);
  const { data: myProjectsList, isLoading: myProjectsLoading } =
    useGetMyProjectsQuery(user ? { userId: user.id } : undefined, {
      skip: !user,
    });
  const myProjects =
    myProjectsList?.projects.filter(
      (project) => project.ownerId === user?.id,
    ) ?? [];

  useEffect(() => {
    if (isError) {
      showToast({
        severity: 'error',
        summary: 'Не вдалося завантажити учасників.',
        life: 3000,
        actionKey: 'get users',
      });
    }
  }, [isError]);

  useEffect(() => {
    if (!usersLoading && !isError && usersList?.users.length === 0) {
      showToast({
        severity: 'error',
        summary: 'Немає учасників за цими критеріями.',
        life: 3000,
        actionKey: 'get users',
      });
    }
  }, [usersLoading, isError, usersList]);

  return (
    <AuthGuard requireVerified>
      <div className={styles.users}>
        <div className={styles.users__banner}>
          <Image
            className={`${styles.users__image} ${styles['users__image--first']}`}
            src="/images/star.svg"
            alt="star"
            width={33}
            height={35}
          />
          <h2 className={styles.users__title}>
            <span className={styles['users__green-text']}>[УЧАСНИКИ]</span>{' '}
            платформи
          </h2>
          <Image
            className={`${styles.users__image} ${styles['users__image--last']}`}
            src="/images/star.svg"
            alt="star"
            width={33}
            height={35}
          />
        </div>
        <div className={styles.users__container}>
          <UsersFilters />
          {usersLoading || myProjectsLoading ? (
            <ListSkeleton height={288} lines={10} />
          ) : usersList?.users.length ? (
            <UsersList users={usersList.users} myProjects={myProjects} />
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
    </AuthGuard>
  );
}
