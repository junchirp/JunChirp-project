'use client';

import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';

type UrlFilterValue = string | number | string[] | null | undefined;

interface UseUrlFiltersOptions<T extends object> {
  keys: readonly (keyof T)[];
  parse: (searchParams: URLSearchParams) => T;
}

export interface UseUrlFiltersResult<T extends object> {
  filters: T;
  updateFilters: (newParams: Partial<Record<keyof T, UrlFilterValue>>) => void;
}

export const useUrlFilters = <T extends object>({
  keys,
  parse,
}: UseUrlFiltersOptions<T>): UseUrlFiltersResult<T> => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filters = useMemo(() => parse(searchParams), [searchParams, parse]);

  const updateFilters = useCallback(
    (newParams: Partial<Record<keyof T, UrlFilterValue>>): void => {
      const current = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (!keys.includes(key as keyof T)) {
          return;
        }

        if (value === undefined || value === null || value === '') {
          current.delete(key);
          return;
        }

        if (Array.isArray(value)) {
          current.delete(key);
          value.forEach((item) => {
            current.append(key, String(item));
          });
          return;
        }
        current.set(key, String(value));
      });
      router.push(`?${current.toString()}`, { scroll: false });
    },
    [searchParams, router, keys],
  );
  return { filters, updateFilters };
};
