import { ProjectRoleTypeInterface } from './project-role-type.interface';

export interface UserBaseInterface {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  activeProjectsCount: number;
  doneProjectsCount: number;
  desiredRoles: ProjectRoleTypeInterface[];
}
