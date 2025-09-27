import { RoleWithProjectInterface } from './role-with-project.interface';

export interface ProjectParticipationInterface {
  id: string;
  userId: string;
  projectRole: RoleWithProjectInterface;
}
