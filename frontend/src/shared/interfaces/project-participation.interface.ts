import { ProjectRoleWithProjectInterface } from './project-role-with-project.interface';

export interface ProjectParticipationInterface {
  id: string;
  userId: string;
  projectRole: ProjectRoleWithProjectInterface;
}
