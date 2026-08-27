import { ProjectCardInterface } from './project-card.interface';
import { UserBaseInterface } from '@/shared/interfaces/user-base.interface';

export interface ProjectInterface extends ProjectCardInterface {
  discordUrl: string;
  owner: UserBaseInterface;
}
