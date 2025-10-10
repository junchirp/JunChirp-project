'use client';

import { ReactElement, useEffect } from 'react';
import AuthGuard from '../../shared/components/AuthGuard/AuthGuard';
import styles from './page.module.scss';
import Image from 'next/image';
import MyProjects from './MyProjects/MyProjects';
import { useGetProjectsQuery } from '../../api/projectsApi';
import { useToast } from '../../hooks/useToast';
import Pagination from '../../shared/components/Pagination/Pagination';
import ListSkeleton from '../../shared/components/ListSkeleton/ListSkeleton';
import ProjectsList from './ProjectsList/ProjectsList';
import {
  useGetMyInvitesQuery,
  useGetMyProjectsQuery,
  useGetMyRequestsQuery,
} from '../../api/usersApi';
import ProjectsFilters from './ProjectsFilters/ProjectsFilters';
import { useProjectsFilters } from '../../hooks/useProjectsFilters';
import { useAppSelector } from '../../hooks/reduxHooks';
import authSelector from '../../redux/auth/authSelector';

export default function Projects(): ReactElement {
  const { filters, updateFilters } = useProjectsFilters();
  const { showToast } = useToast();
  const user = useAppSelector(authSelector.selectUser);

  const onPageChange = (page: number): void => {
    updateFilters({ page });
  };

  const {
    data: list,
    isLoading: listLoading,
    isError: listError,
  } = useGetProjectsQuery(filters);
  const { data: requests = [], isLoading: requestsLoading } =
    useGetMyRequestsQuery(user ? { userId: user.id } : undefined, {
      skip: !user,
    });
  const { data: invites = [], isLoading: invitesLoading } =
    useGetMyInvitesQuery(user ? { userId: user.id } : undefined, {
      skip: !user,
    });
  const { data: myProjectsList, isLoading: myProjectsLoading } =
    useGetMyProjectsQuery(user ? { userId: user.id } : undefined, {
      skip: !user,
    });

  const isLoading =
    listLoading || requestsLoading || invitesLoading || myProjectsLoading;

  useEffect(() => {
    if (listError) {
      showToast({
        severity: 'error',
        summary: 'Не вдалося завантажити проєкти.',
        life: 3000,
        actionKey: 'get users',
      });
    }
  }, [listError]);

  return (
    <AuthGuard requireVerified>
      <div className={styles.projects}>
        <div className={styles.projects__banner}>
          <Image
            className={`${styles.projects__image} ${styles['projects__image--first']}`}
            src="/images/star.svg"
            alt="star"
            width={33}
            height={35}
          />
          <h2 className={styles.projects__title}>[Проєкти]</h2>
          <Image
            className={`${styles.projects__image} ${styles['projects__image--last']}`}
            src="/images/star.svg"
            alt="star"
            width={33}
            height={35}
          />
        </div>
        <div className={styles.projects__container}>
          <ProjectsFilters />
          {myProjectsLoading ? (
            <ListSkeleton height={341} />
          ) : myProjectsList && user ? (
            <MyProjects myProjects={myProjectsList.projects} user={user} />
          ) : null}
          {isLoading ? (
            <ListSkeleton height={562} lines={10} />
          ) : list?.projects.length ? (
            <ProjectsList
              projects={list.projects}
              invites={invites}
              requests={requests}
              user={user}
            />
          ) : null}
          {!!list?.projects.length && (
            <Pagination
              total={list.total}
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
