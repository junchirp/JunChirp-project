import { ProjectRoleTypeInterface } from './project-role-type.interface';

export interface UserCardInterface {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  activeProjectsCount: number;
  doneProjectsCount: number;
  desiredRoles: ProjectRoleTypeInterface[];
}
