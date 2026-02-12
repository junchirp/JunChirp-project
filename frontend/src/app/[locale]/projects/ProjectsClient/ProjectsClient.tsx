'use client';

import { ReactElement } from 'react';
import AuthGuard from '@/shared/components/AuthGuard/AuthGuard';
import styles from './ProjectsClient.module.scss';
import Image from 'next/image';
import MyProjects from './MyProjects/MyProjects';
import { useGetProjectsQuery } from '@/api/projectsApi';
import Pagination from '@/shared/components/Pagination/Pagination';
import ListSkeleton from '@/shared/components/ListSkeleton/ListSkeleton';
import ProjectsList from './ProjectsList/ProjectsList';
import {
  useGetMyInvitesQuery,
  useGetMyProjectsQuery,
  useGetMyRequestsQuery,
} from '@/api/usersApi';
import ProjectsFilters from './ProjectsFilters/ProjectsFilters';
import { useProjectsFilters } from '@/hooks/useProjectsFilters';
import { useAppSelector } from '@/hooks/reduxHooks';
import authSelector from '@/redux/auth/authSelector';
import { useTranslations } from 'next-intl';
import { usePathname } from '../../../../i18n/routing';

export default function ProjectsClient(): ReactElement {
  const { filters, updateFilters } = useProjectsFilters();
  const pathname = usePathname();
  const user = useAppSelector(authSelector.selectUser);
  const t = useTranslations('projectsPage');

  const onPageChange = (page: number): void => {
    updateFilters({ page });
  };

  const { data: list, isLoading: listLoading } = useGetProjectsQuery(filters);
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

  return (
    <AuthGuard
      requireVerified
      redirectTo={`/auth/login?next=${encodeURIComponent(pathname)}`}
    >
      <div className={styles['projects-client']}>
        <div className={styles.projects__banner}>
          <Image
            className={`${styles['projects-client__image']} ${styles['projects-client__image--first']}`}
            src="/images/star.svg"
            alt="star"
            width={33}
            height={35}
          />
          <h2 className={styles['projects-client__title']}>
            [{t('bannerName')}]
          </h2>
          <Image
            className={`${styles['projects-client__image']} ${styles['projects-client__image--last']}`}
            src="/images/star.svg"
            alt="star"
            width={33}
            height={35}
          />
        </div>
        <div className={styles['projects-client__container']}>
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
