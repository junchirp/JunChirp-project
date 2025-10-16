import { EducationInterface } from './education.interface';

export interface UserCardInterface {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  activeProjectsCount: number;
  doneProjectsCount: number;
  educations: EducationInterface[];
}
