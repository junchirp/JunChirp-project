import { ReactElement, useEffect, useState } from 'react';
import { ProjectCardInterface } from '../../../../shared/interfaces/project-card.interface';
import { useGetUserProjectsQuery } from '../../../../api/usersApi';
import styles from './UserProjectsList.module.scss';
import UserProject from './UserProject/UserProject';
import Button from '../../../../shared/components/Button/Button';
import Image from 'next/image';

interface UserProjectsListProps {
  userId: string;
}

export default function UserProjectsList({
  userId,
}: UserProjectsListProps): ReactElement {
  const [page, setPage] = useState(1);
  const [allProjects, setAllProjects] = useState<ProjectCardInterface[]>([]);

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
    if (list) {
      setAllProjects((prev) => [...prev, ...list.projects]);
    }
  }, [list]);

  useEffect(() => {
    setAllProjects([]);
    setPage(1);
  }, [userId]);

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
        <UserProject key={project.id} project={project} />
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
