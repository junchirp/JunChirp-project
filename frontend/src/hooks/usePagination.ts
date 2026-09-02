'use client';

import { useEffect } from 'react';
import { PaginationInterface } from '@/shared/interfaces/pagination.interface';
import { UrlFilterValueType } from '@/shared/types/url-filter-value.type';
import { PaginationResultInterface } from '@/shared/interfaces/pagination-result.interface';

export function usePagination<T>({
  filters,
  pageKey,
  limitKey,
  total,
  allowedLimits,
  defaultLimit,
  updateFilters,
}: PaginationInterface<T>): PaginationResultInterface {
  useEffect(() => {
    const limit = Number(filters[limitKey]);
    const page = Number(filters[pageKey]);

    const validLimit = allowedLimits.includes(limit) ? limit : defaultLimit;

    const totalPages = Math.ceil(total / validLimit);
    const validPage = Math.max(1, Math.min(page, totalPages));

    if (validLimit !== limit || validPage !== page) {
      updateFilters({
        [limitKey]: validLimit,
        [pageKey]: validPage,
      } as Partial<Record<keyof T, UrlFilterValueType>>);
    }
  }, [
    filters,
    pageKey,
    limitKey,
    total,
    allowedLimits,
    defaultLimit,
    updateFilters,
  ]);

  const onPageChange = (page: number): void => {
    updateFilters({
      [pageKey]: page,
    } as Partial<Record<keyof T, UrlFilterValueType>>);
  };

  const onLimitChange = (limit: number): void => {
    updateFilters({
      [limitKey]: limit,
      [pageKey]: 1,
    } as Partial<Record<keyof T, UrlFilterValueType>>);
  };

  return {
    onPageChange,
    onLimitChange,
  };
}
