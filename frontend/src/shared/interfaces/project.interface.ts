import { ProjectCardInterface } from './project-card.interface';
import { UserCardInterface } from '@/shared/interfaces/user-card.interface';

export interface ProjectInterface extends ProjectCardInterface {
  discordUrl: string;
  owner: UserCardInterface;
}
