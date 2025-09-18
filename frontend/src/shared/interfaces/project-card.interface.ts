import { ProjectRoleInterface } from '@/shared/interfaces/project-role.interface';
import { ProjectCategoryInterface } from './project-category.interface';

export interface ProjectCardInterface {
  id: string;
  projectName: string;
  description: string;
  status: 'active' | 'done';
  createdAt: Date;
  participantsCount: number;
  ownerId: string;
  logoUrl: string | null;
  roles: ProjectRoleInterface[];
  category: ProjectCategoryInterface;
}
