import { UserCardInterface } from './user-card.interface';
import { ProjectRoleInterface } from './project-role.interface';

export interface UserParticipationInterface {
  id: string;
  user: UserCardInterface;
  createdAt: Date;
  projectRole: ProjectRoleInterface;
}
