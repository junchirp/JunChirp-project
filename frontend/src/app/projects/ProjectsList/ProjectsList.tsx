import { ReactElement } from 'react';
import styles from './ProjectsList.module.scss';
import { ProjectCardInterface } from '../../../shared/interfaces/project-card.interface';
import ProjectCard from './ProjectCard/ProjectCard';

interface ProjectsListProps {
  projects: ProjectCardInterface[];
  invitesProjectsIds: string[];
  requestsProjectsIds: string[];
}

export default function ProjectsList({
  projects,
  invitesProjectsIds,
  requestsProjectsIds,
}: ProjectsListProps): ReactElement {
  return (
    <div className={styles['projects-list']}>
      <h3 className={styles['projects-list__title']}>Список проєктів</h3>
      <div className={styles['projects-list__list']}>
        {projects.map((project: ProjectCardInterface) => (
          <ProjectCard
            key={project.id}
            project={project}
            invitesProjectsIds={invitesProjectsIds}
            requestsProjectsIds={requestsProjectsIds}
          />
        ))}
      </div>
    </div>
  );
}
