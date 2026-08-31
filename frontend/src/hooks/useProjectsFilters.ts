'use client';

import { ProjectsFiltersInterface } from '@/shared/interfaces/projects-filters.interface';
import { useUrlFilters } from './useUrlFilters';

interface ProjectsFiltersResultInterface {
  filters: ProjectsFiltersInterface;
  updateFilters: (
    newParams: Record<
      string,
      string | number | undefined | null | 'active' | 'done'
    >,
  ) => void;
}

const PROJECT_FILTER_KEYS = [
  'page',
  'limit',
  'status',
  'categoryId',
  'minParticipants',
  'maxParticipants',
  'roleTypeId',
] as const satisfies readonly (keyof ProjectsFiltersInterface)[];

const parse = (searchParams: URLSearchParams): ProjectsFiltersInterface => {
  const min = searchParams.get('minParticipants');
  const max = searchParams.get('maxParticipants');

  return {
    page: Number(searchParams.get('page') ?? 1),
    limit: Number(searchParams.get('limit') ?? 20),
    status: (searchParams.get('status') as 'active' | 'done') ?? undefined,
    categoryId: searchParams.get('categoryId') ?? undefined,
    minParticipants: min !== null ? Number(min) : undefined,
    maxParticipants: max !== null ? Number(max) : undefined,
    roleTypeId: searchParams.get('roleTypeId') ?? undefined,
  };
};

export const useProjectsFilters = (): ProjectsFiltersResultInterface => {
  const result = useUrlFilters<ProjectsFiltersInterface>({
    keys: PROJECT_FILTER_KEYS,
    parse,
  });

  const updateFilters = (
    newParams: Partial<
      Record<
        keyof ProjectsFiltersInterface,
        string | number | string[] | null | undefined
      >
    >,
  ): void => {
    result.updateFilters(
      Object.fromEntries(
        Object.entries(newParams).map(([key, value]) => [
          key,
          value === 0 ? undefined : value,
        ]),
      ) as Partial<
        Record<
          keyof ProjectsFiltersInterface,
          string | number | string[] | null | undefined
        >
      >,
    );
  };

  return { filters: result.filters, updateFilters };
};
