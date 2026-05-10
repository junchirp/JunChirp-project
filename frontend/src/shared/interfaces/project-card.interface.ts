import { ProjectCategoryInterface } from './project-category.interface';
import { RoleWithUserInterface } from './role-with-user.interface';
import { ProjectLogoInterface } from './project-logo.interface';

export interface ProjectCardInterface {
  id: string;
  projectName: string;
  description: string;
  status: 'active' | 'done';
  createdAt: Date;
  participantsCount: number;
  ownerId: string;
  logo: ProjectLogoInterface | null;
  publicUrl: string | null;
  duration: number | null;
  roles: RoleWithUserInterface[];
  category: ProjectCategoryInterface;
}
