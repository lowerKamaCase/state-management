export interface PaginateCarsResult {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

export interface PaginateCarsContract {
  usePaginateCars: () => PaginateCarsResult;
}
