'use client';

import { UsersFiltersInterface } from '@/shared/interfaces/users-filters.interface';
import { useUrlFilters, UseUrlFiltersResult } from '@/hooks/useUrlFilters';

const USER_FILTER_KEYS = [
  'page',
  'limit',
  'activeProjectsCount',
  'desiredRolesIds',
] as const satisfies readonly (keyof UsersFiltersInterface)[];

const parse = (searchParams: URLSearchParams): UsersFiltersInterface => ({
  page: Number(searchParams.get('page') ?? 1),
  limit: Number(searchParams.get('limit') ?? 20),
  activeProjectsCount: searchParams.get('activeProjectsCount')
    ? Number(searchParams.get('activeProjectsCount'))
    : undefined,
  desiredRolesIds: searchParams.getAll('desiredRolesIds'),
});

export const useUsersFilters =
  (): UseUrlFiltersResult<UsersFiltersInterface> => {
    return useUrlFilters<UsersFiltersInterface>({
      keys: USER_FILTER_KEYS,
      parse,
    });
  };
