import { ProjectRoleInterface } from './project-role.interface';
import { ProjectCardInterface } from './project-card.interface';

export interface ProjectRoleWithProjectInterface extends ProjectRoleInterface {
  project: ProjectCardInterface;
}
