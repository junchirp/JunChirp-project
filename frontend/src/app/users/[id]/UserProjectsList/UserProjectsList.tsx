import { ReactElement, useEffect, useState } from 'react';
import { ProjectCardInterface } from '../../../../shared/interfaces/project-card.interface';
import { useGetUserProjectsQuery } from '../../../../api/usersApi';
import styles from './UserProjectsList.module.scss';
import UserProjectCard from '../../../../shared/components/UserProjectCard/UserProjectCard';
import Button from '../../../../shared/components/Button/Button';
import Image from 'next/image';
import { useAppSelector } from '../../../../hooks/reduxHooks';
import uiSelector from '../../../../redux/ui/uiSelector';

interface UserProjectsListProps {
  userId: string;
}

export default function UserProjectsList({
  userId,
}: UserProjectsListProps): ReactElement {
  const [page, setPage] = useState(1);
  const [allProjects, setAllProjects] = useState<ProjectCardInterface[]>([]);
  const resetKey = useAppSelector(uiSelector.selectResetUserProjectsKey);

  const {
    data: list,
    isFetching,
    isLoading,
  } = useGetUserProjectsQuery({
    id: userId,
    params: {
      page,
      limit: 5,
    },
  });

  useEffect(() => {
    if (!list) {
      return;
    }

    setAllProjects((prev) => {
      if (page === 1) {
        return list.projects;
      }
      const merged = [...prev, ...list.projects];
      return merged.filter(
        (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i,
      );
    });
  }, [list, page]);

  useEffect(() => {
    setAllProjects([]);
    setPage(1);
  }, [resetKey, userId]);

  const hasMoreProjects = list && allProjects.length < list.total;

  const loadMoreProjects = (): void => {
    if (isFetching || isLoading) {
      return;
    }
    setPage((prev) => prev + 1);
  };

  return (
    <div className={styles['user-projects-list']}>
      {allProjects.map((project) => (
        <UserProjectCard key={project.id} project={project} />
      ))}
      {hasMoreProjects && (
        <div className={styles['user-projects-list__more']}>
          <Button
            color="black"
            variant="link"
            size="lg"
            onClick={loadMoreProjects}
          >
            Показати більше
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
