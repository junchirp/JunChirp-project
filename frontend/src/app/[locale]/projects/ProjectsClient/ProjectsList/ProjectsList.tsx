'use client';

import { ReactElement } from 'react';
import styles from './ProjectsList.module.scss';
import { AuthInterface } from '@/shared/interfaces/auth.interface';
import { useTranslations } from 'next-intl';
import ProjectCardSmall from '@/shared/components/ProjectCardSmall/ProjectCardSmall';
import { ProjectCardExpandedInterface } from '@/shared/interfaces/project-card-expanded.interface';

interface ProjectsListProps {
  projects: ProjectCardExpandedInterface[];
  user: AuthInterface;
}

export default function ProjectsList({
  projects,
  user,
}: ProjectsListProps): ReactElement {
  const t = useTranslations('projectsPage');

  return (
    <div className={styles['projects-list']}>
      <h3 className={styles['projects-list__title']}>{t('projectList')}</h3>
      <div className={styles['projects-list__list']}>
        {projects.map((project) => (
          <ProjectCardSmall key={project.id} project={project} user={user} />
        ))}
      </div>
    </div>
  );
}
