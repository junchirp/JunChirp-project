import { ProjectRoleTypeInterface } from './project-role-type.interface';

export interface ProjectRoleInterface {
  id: string;
  slots: number;
  roleType: ProjectRoleTypeInterface;
}
