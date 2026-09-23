'use client';

import { ReactElement, useEffect, useMemo, useState } from 'react';
import { useGetUserProjectsQuery } from '@/api/projectsApi';
import styles from './UserProjectsList.module.scss';
import Button from '@/shared/components/Button/Button';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ProjectCardSmall from '@/shared/components/ProjectCardSmall/ProjectCardSmall';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import { ProjectCardExpandedInterface } from '@/shared/interfaces/project-card-expanded.interface';

interface UserProjectsListProps {
  userId: string;
  filter: null | 'active' | 'done';
  authUser: AuthInterface;
}

export default function UserProjectsList({
  userId,
  filter,
  authUser,
}: UserProjectsListProps): ReactElement {
  const [page, setPage] = useState(1);
  const [allProjects, setAllProjects] = useState<
    ProjectCardExpandedInterface[]
  >([]);
  const t = useTranslations('profile');

  const queryArgs = useMemo(() => {
    return {
      id: userId,
      params: {
        page,
        limit: 5,
        status: filter ?? undefined,
      },
    };
  }, [userId, page, filter]);

  const {
    data: list,
    isFetching,
    isLoading,
  } = useGetUserProjectsQuery(queryArgs);

  useEffect(() => {
    if (!list) {
      return;
    }

    setAllProjects((prev) => {
      if (page === 1) {
        return list.projects;
      }

      const merged = [...prev, ...list.projects];

      return Array.from(new Map(merged.map((p) => [p.id, p])).values());
    });
  }, [list, page]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const hasMoreProjects = Boolean(list && allProjects.length < list.total);

  const loadMoreProjects = (): void => {
    if (isFetching || isLoading) {
      return;
    }
    setPage((prev) => prev + 1);
  };

  return (
    <div className={styles['user-projects-list']}>
      {allProjects.map((project) => (
        <ProjectCardSmall key={project.id} project={project} user={authUser} />
      ))}
      {hasMoreProjects && (
        <div className={styles['user-projects-list__more']}>
          <Button
            color="black"
            variant="link"
            size="lg"
            onClick={loadMoreProjects}
          >
            {t('showMore')}
          </Button>
          <Image
            src="/images/arrow-right.svg"
            alt="arrow"
            width={160}
            height={160}
          />
        </div>
      )}
    </div>
  );
}
