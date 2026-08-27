import { ProjectCardInterface } from './project-card.interface';
import { UserBaseInterface } from '@/shared/interfaces/user-base.interface';
import { MyParticipationInterface } from '@/shared/interfaces/my-participation.interface';

export interface ProjectInterface extends ProjectCardInterface {
  discordUrl: string;
  owner: UserBaseInterface;
  myParticipation: MyParticipationInterface | null;
}
