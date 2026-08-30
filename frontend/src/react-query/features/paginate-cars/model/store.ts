import { useState } from 'react';
import { DEFAULT_PAGE } from '../../../../shared/entities/car/model/types';
import type { PaginateCarsContract } from '../../../../shared/features/paginate-cars/model/contract';

export function usePaginateCars() {
  const [page, setPage] = useState(DEFAULT_PAGE.page);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE.pageSize);
  return { page, pageSize, setPage, setPageSize };
}

const _typecheck: PaginateCarsContract = { usePaginateCars };
void _typecheck;
