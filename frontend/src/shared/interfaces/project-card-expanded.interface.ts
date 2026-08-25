import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';
import { MyParticipationInterface } from '@/shared/interfaces/my-participation.interface';

export interface ProjectCardExpandedInterface extends ProjectCardInterface {
  myParticipation: MyParticipationInterface | null;
}
