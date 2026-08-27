import { ProjectCategoryInterface } from './project-category.interface';
import { RoleWithUsersInterface } from './role-with-users.interface';
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
  roles: RoleWithUsersInterface[];
  category: ProjectCategoryInterface;
}
