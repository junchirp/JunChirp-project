export interface PaginationResultInterface {
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}
