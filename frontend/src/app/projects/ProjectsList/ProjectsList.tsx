import { ReactElement } from 'react';
import styles from './ProjectsList.module.scss';
import { ProjectCardInterface } from '../../../shared/interfaces/project-card.interface';
import ProjectCard from '../../../shared/components/ProjectCard/ProjectCard';
import { ProjectParticipationInterface } from '../../../shared/interfaces/project-participation.interface';
import { UserInterface } from '../../../shared/interfaces/user.interface';

interface ProjectsListProps {
  projects: ProjectCardInterface[];
  invites: ProjectParticipationInterface[];
  requests: ProjectParticipationInterface[];
  user: UserInterface | null;
}

export default function ProjectsList({
  projects,
  invites,
  requests,
  user,
}: ProjectsListProps): ReactElement {
  return (
    <div className={styles['projects-list']}>
      <h3 className={styles['projects-list__title']}>Список проєктів</h3>
      <div className={styles['projects-list__list']}>
        {projects.map((project: ProjectCardInterface) => (
          <ProjectCard
            key={project.id}
            project={project}
            invites={invites}
            requests={requests}
            user={user}
          />
        ))}
      </div>
    </div>
  );
}
