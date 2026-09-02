import { UrlFilterValueType } from '@/shared/types/url-filter-value.type';

export interface PaginationInterface<T> {
  filters: T;
  pageKey: keyof T;
  limitKey: keyof T;
  total: number;
  allowedLimits: number[];
  defaultLimit: number;
  updateFilters: (
    newParams: Partial<Record<keyof T, UrlFilterValueType>>,
  ) => void;
}
