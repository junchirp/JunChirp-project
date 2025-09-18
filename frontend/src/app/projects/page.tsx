'use client';

import { ReactElement, useEffect } from 'react';
import AuthGuard from '../../shared/components/AuthGuard/AuthGuard';
import styles from './page.module.scss';
import Image from 'next/image';
import MyProjects from './MyProjects/MyProjects';
import { useGetProjectsQuery } from '../../api/projectsApi';
import { useUsersFilters } from '../../hooks/useUsersFilters';
import { useToast } from '../../hooks/useToast';
import Pagination from '../../shared/components/Pagination/Pagination';
import ListSkeleton from '../../shared/components/ListSkeleton/ListSkeleton';
import ProjectsList from './ProjectsList/ProjectsList';
import {
  useGetMyInvitesQuery,
  useGetMyProjectsQuery,
  useGetMyRequestsQuery,
} from '../../api/usersApi';

export default function Projects(): ReactElement {
  const { filters, updateFilters } = useUsersFilters();
  const { showToast } = useToast();

  const onPageChange = (page: number): void => {
    updateFilters({ page });
  };

  const {
    data: list,
    isLoading: listLoading,
    isError: listError,
  } = useGetProjectsQuery(filters);
  const { data: requests = [], isLoading: requestsLoading } =
    useGetMyRequestsQuery(undefined);
  const { data: invites = [], isLoading: invitesLoading } =
    useGetMyInvitesQuery(undefined);
  const { data: myProjectsList, isLoading: myProjectsLoading } =
    useGetMyProjectsQuery(undefined);

  const invitesProjectsIds = invites.map(
    (invite) => invite.projectRole.project.id,
  );
  const requestsProjectsIds = requests.map(
    (request) => request.projectRole.project.id,
  );
  const myProjectsIds =
    myProjectsList?.projects.map((project) => project.id) ?? [];

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
          <div>TODO: projects filter</div>
          {myProjectsLoading ? (
            <ListSkeleton height={341} />
          ) : myProjectsList ? (
            <MyProjects myProjects={myProjectsList.projects} />
          ) : null}
          {isLoading ? (
            <ListSkeleton height={562} lines={10} />
          ) : list?.projects.length ? (
            <ProjectsList
              projects={list.projects}
              invitesProjectsIds={invitesProjectsIds}
              requestsProjectsIds={requestsProjectsIds}
              myProjectsIds={myProjectsIds}
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
