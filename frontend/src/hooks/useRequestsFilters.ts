'use client';

import { useUrlFilters, UseUrlFiltersResult } from '@/hooks/useUrlFilters';
import { RequestsFiltersInterface } from '@/shared/interfaces/requests-filters.interface';

const REQUEST_FILTER_KEYS = [
  'requestsPage',
  'requestsLimit',
] as const satisfies readonly (keyof RequestsFiltersInterface)[];

const parse = (searchParams: URLSearchParams): RequestsFiltersInterface => ({
  requestsPage: Number(searchParams.get('requestsPage') ?? 1),
  requestsLimit: Number(searchParams.get('requestsLimit') ?? 10),
});

export const useRequestsFilters =
  (): UseUrlFiltersResult<RequestsFiltersInterface> => {
    return useUrlFilters<RequestsFiltersInterface>({
      keys: REQUEST_FILTER_KEYS,
      parse,
    });
  };
