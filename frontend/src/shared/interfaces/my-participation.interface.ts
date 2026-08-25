import { ProjectRoleInterface } from '@/shared/interfaces/project-role.interface';
import { ParticipationType } from '@/shared/types/participation.type';

export interface MyParticipationInterface {
  id: string;
  type: ParticipationType;
  projectRole: ProjectRoleInterface;
}
