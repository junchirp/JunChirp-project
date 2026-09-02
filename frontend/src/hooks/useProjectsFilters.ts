'use client';

import { ProjectsFiltersInterface } from '@/shared/interfaces/projects-filters.interface';
import { useUrlFilters, UseUrlFiltersResult } from './useUrlFilters';
import { UrlFilterValueType } from '@/shared/types/url-filter-value.type';

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

export const useProjectsFilters =
  (): UseUrlFiltersResult<ProjectsFiltersInterface> => {
    const result = useUrlFilters<ProjectsFiltersInterface>({
      keys: PROJECT_FILTER_KEYS,
      parse,
    });

    const updateFilters = (
      newParams: Partial<
        Record<keyof ProjectsFiltersInterface, UrlFilterValueType>
      >,
    ): void => {
      result.updateFilters(
        Object.fromEntries(
          Object.entries(newParams).map(([key, value]) => [
            key,
            value === 0 ? undefined : value,
          ]),
        ) as Partial<
          Record<keyof ProjectsFiltersInterface, UrlFilterValueType>
        >,
      );
    };

    return { filters: result.filters, updateFilters };
  };
