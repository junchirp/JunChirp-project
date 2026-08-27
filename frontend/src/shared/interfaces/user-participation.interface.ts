import { ProjectRoleInterface } from '@/shared/interfaces/project-role.interface';
import { UserBaseInterface } from '@/shared/interfaces/user-base.interface';

export interface UserParticipationInterface {
  id: string;
  user: UserBaseInterface;
  createdAt: Date;
  projectRole: ProjectRoleInterface;
}
