export interface ProjectsFiltersInterface {
  page: number;
  limit: number;
  status?: 'active' | 'done';
  categoryId?: string;
  minParticipants?: number;
  maxParticipants?: number;
}
