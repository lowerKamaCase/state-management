import { createEvent, createStore } from 'effector';
import { useUnit } from 'effector-react';
import { DEFAULT_PAGE } from '../../../../shared/entities/car/model/types';
import type { PaginateCarsContract } from '../../../../shared/features/paginate-cars/model/contract';

const pageChanged = createEvent<number>();
const pageSizeChanged = createEvent<number>();

const $page = createStore(DEFAULT_PAGE)
  .on(pageChanged, (s, page) => {
    return { ...s, page };
  })
  .on(pageSizeChanged, (s, pageSize) => {
    return { ...s, pageSize };
  });

export function usePaginateCars() {
  const [page, setPage, setPageSize] = useUnit([
    $page,
    pageChanged,
    pageSizeChanged,
  ]);
  return { page: page.page, pageSize: page.pageSize, setPage, setPageSize };
}

const _typecheck: PaginateCarsContract = { usePaginateCars };
void _typecheck;
