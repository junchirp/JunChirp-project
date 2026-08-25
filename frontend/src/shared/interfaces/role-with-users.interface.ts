import { ProjectRoleInterface } from './project-role.interface';
import { UserBaseInterface } from '@/shared/interfaces/user-base.interface';

export interface RoleWithUsersInterface extends ProjectRoleInterface {
  users: UserBaseInterface[];
}
