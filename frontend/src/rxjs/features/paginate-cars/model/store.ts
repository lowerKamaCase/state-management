import { BehaviorSubject } from 'rxjs';
import { DEFAULT_PAGE } from '../../../../shared/entities/car/model/types';
import type { PaginateCarsContract } from '../../../../shared/features/paginate-cars/model/contract';
import { useBehaviorSubject } from '../../../../shared/lib/useBehaviorSubject';

const page$ = new BehaviorSubject(DEFAULT_PAGE);

export function usePaginateCars() {
  const page = useBehaviorSubject(page$);
  return {
    page: page.page,
    pageSize: page.pageSize,
    setPage: (nextPage: number) => {
      page$.next({ ...page$.getValue(), page: nextPage });
    },
    setPageSize: (pageSize: number) => {
      page$.next({ ...page$.getValue(), pageSize });
    },
  };
}

const _typecheck: PaginateCarsContract = { usePaginateCars };
void _typecheck;
