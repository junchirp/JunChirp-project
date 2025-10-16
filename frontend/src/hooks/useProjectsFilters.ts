'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { ProjectsFiltersInterface } from '@/shared/interfaces/projects-filters.interface';

interface ProjectsFiltersResultInterface {
  filters: ProjectsFiltersInterface;
  updateFilters: (
    newParams: Record<
      string,
      string | number | undefined | null | 'active' | 'done'
    >,
  ) => void;
}

export const useProjectsFilters = (): ProjectsFiltersResultInterface => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const min = searchParams.get('minParticipants');
  const max = searchParams.get('maxParticipants');

  const filters = useMemo(() => {
    return {
      page: Number(searchParams.get('page') ?? 1),
      limit: Number(searchParams.get('limit') ?? 5),
      status: (searchParams.get('status') as 'active' | 'done') ?? undefined,
      categoryId: searchParams.get('categoryId') ?? undefined,
      minParticipants: min !== null ? Number(min) : undefined,
      maxParticipants: max !== null ? Number(max) : undefined,
    };
  }, [searchParams]);

  const updateFilters = (
    newParams: Record<string, string | number | undefined | null>,
  ): void => {
    const current = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === '' ||
        value === 0
      ) {
        current.delete(key);
      } else {
        current.set(key, String(value));
      }
    });

    router.push(`?${current.toString()}`, { scroll: false });
  };

  return { filters, updateFilters };
};
