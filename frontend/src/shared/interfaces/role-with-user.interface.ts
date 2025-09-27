import { UserCardInterface } from './user-card.interface';
import { ProjectRoleInterface } from './project-role.interface';

export interface RoleWithUserInterface extends ProjectRoleInterface {
  user: UserCardInterface | null;
}
