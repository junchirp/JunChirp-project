import { ProjectCardInterface } from '@/shared/interfaces/project-card.interface';
import { DocumentInterface } from '@/shared/interfaces/ducument.interface';
import { BoardInterface } from '@/shared/interfaces/board.interface';
import { RoleWithUserInterface } from './role-with-user.interface';

export interface ProjectInterface extends Omit<ProjectCardInterface, 'roles'> {
  discordUrl: string;
  documents: DocumentInterface[];
  boards: BoardInterface[];
  roles: RoleWithUserInterface[];
}
