import { UserCardInterface } from '@/shared/interfaces/user-card.interface';
import { ProjectRoleInterface } from '@/shared/interfaces/project-role.interface';

export interface UserParticipationInterface {
  id: string;
  user: UserCardInterface;
  createdAt: Date;
  projectRole: ProjectRoleInterface;
}
