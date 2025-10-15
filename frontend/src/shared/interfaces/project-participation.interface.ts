import { RoleWithProjectInterface } from './role-with-project.interface';

export interface ProjectParticipationInterface {
  id: string;
  userId: string;
  createdAt: Date;
  projectRole: RoleWithProjectInterface;
}
