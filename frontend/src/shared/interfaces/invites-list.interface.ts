import { ProjectParticipationInterface } from '@/shared/interfaces/project-participation.interface';

export interface InvitesListInterface {
  total: number;
  invites: ProjectParticipationInterface[];
}
