import { ProjectCardExpandedInterface } from '@/shared/interfaces/project-card-expanded.interface';

export interface ProjectsListInterface {
  total: number;
  projects: ProjectCardExpandedInterface[];
}
