export interface UsersFiltersInterface {
  page: number;
  limit: number;
  activeProjectsCount?: number;
  desiredRolesIds?: string[];
}
