import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';

export interface RequestsListInterface {
  total: number;
  requests: ProjectParticipationInterface[];
}
