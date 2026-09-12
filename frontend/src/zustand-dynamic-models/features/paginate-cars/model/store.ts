import { useState } from 'react';
import { create } from 'zustand';
import { DEFAULT_PAGE } from '../../../../shared/entities/car/model/types';
import type { PaginateCarsContract } from '../../../../shared/features/paginate-cars/model/contract';

interface PaginateCarsState {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

function createPaginateCarsStore() {
  return create<PaginateCarsState>((set) => {
    return {
      ...DEFAULT_PAGE,
      setPage: (page) => {
        set({ page });
      },
      setPageSize: (pageSize) => {
        set({ pageSize });
      },
    };
  });
}

export function usePaginateCars() {
  const [usePaginateCarsStore] = useState(() => {
    return createPaginateCarsStore();
  });
  const page = usePaginateCarsStore((s) => {
    return s.page;
  });
  const pageSize = usePaginateCarsStore((s) => {
    return s.pageSize;
  });
  const setPage = usePaginateCarsStore((s) => {
    return s.setPage;
  });
  const setPageSize = usePaginateCarsStore((s) => {
    return s.setPageSize;
  });
  return { page, pageSize, setPage, setPageSize };
}

const _typecheck: PaginateCarsContract = { usePaginateCars };
void _typecheck;
