import { ProjectRoleInterface } from './project-role.interface';
import { ProjectCardInterface } from './project-card.interface';

export interface RoleWithProjectInterface extends ProjectRoleInterface {
  project: ProjectCardInterface;
}
