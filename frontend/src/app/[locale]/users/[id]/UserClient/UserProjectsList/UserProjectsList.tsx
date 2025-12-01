'use client';

import { ReactElement, useEffect, useMemo, useState } from 'react';
import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';
import { useGetUserProjectsQuery } from '@/api/usersApi';
import styles from './UserProjectsList.module.scss';
import UserProjectCard from '@/shared/components/UserProjectCard/UserProjectCard';
import Button from '@/shared/components/Button/Button';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface UserProjectsListProps {
  userId: string;
  filter: null | 'active' | 'done';
}

export default function UserProjectsList({
  userId,
  filter,
}: UserProjectsListProps): ReactElement {
  const [page, setPage] = useState(1);
  const [allProjects, setAllProjects] = useState<ProjectCardInterface[]>([]);
  const t = useTranslations('profile');
  const [listLoaded, setListLoaded] = useState(false);

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
    refetch,
  } = useGetUserProjectsQuery(queryArgs);

  useEffect(() => {
    if (!list) {
      return;
    }

    setListLoaded(true);
    setAllProjects((prev) => {
      if (page === 1) {
        return list.projects;
      }

      const merged = [...prev, ...list.projects];

      return Array.from(new Map(merged.map((p) => [p.id, p])).values());
    });
  }, [list, page]);

  useEffect(() => {
    setListLoaded(false);
    setAllProjects([]);

    if (page !== 1) {
      setPage(1);
    } else {
      refetch().then((res) => {
        if ('data' in res) {
          setAllProjects(res.data?.projects ?? []);
        }
      });
    }
  }, [filter]);

  useEffect(() => {
    let mounted = true;
    const handleVisibility = async (): Promise<void> => {
      if (document.visibilityState === 'visible') {
        setAllProjects([]);
        if (page !== 1) {
          setPage(1);
        } else {
          const res = await refetch();
          if (!mounted) {
            return;
          }
          if ('data' in res) {
            setAllProjects(res.data?.projects ?? []);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return (): void => {
      mounted = false;
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [page, refetch]);

  const hasMoreProjects = Boolean(
    listLoaded && list && allProjects.length < list.total,
  );

  const loadMoreProjects = (): void => {
    if (isFetching || isLoading) {
      return;
    }
    setPage((prev) => prev + 1);
  };

  return (
    <div className={styles['user-projects-list']}>
      {allProjects.map((project) => (
        <UserProjectCard key={project.id} project={project} userId={userId} />
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
