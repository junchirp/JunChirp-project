'use client';

import { ReactElement } from 'react';
import styles from './MyProjects.module.scss';
import Button from '../../../shared/components/Button/Button';
import UserProjectCard from '../../../shared/components/UserProjectCard/UserProjectCard';
import { ProjectCardInterface } from '../../../shared/interfaces/project-card.interface';

interface MyProjectsProps {
  myProjects: ProjectCardInterface[];
}

export default function MyProjects({
  myProjects,
}: MyProjectsProps): ReactElement {
  return (
    <div className={styles['my-projects']}>
      <h3 className={styles['my-projects__title']}>Мої проєкти</h3>
      <div className={styles['my-projects__list-wrapper']}>
        <Button className={styles['my-projects__button']} color="green">
          Створити проєкт
        </Button>
        {!!myProjects.length && (
          <div className={styles['my-projects__list']}>
            {myProjects.map((project) => (
              <UserProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
