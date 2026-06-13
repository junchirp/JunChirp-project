import { ProjectCardInterface } from './project-card.interface';
import { DocumentInterface } from './ducument.interface';
import { BoardInterface } from './board.interface';

export interface ProjectInterface extends ProjectCardInterface {
  discordUrl: string;
  documents: DocumentInterface[];
  boards: BoardInterface[];
}
