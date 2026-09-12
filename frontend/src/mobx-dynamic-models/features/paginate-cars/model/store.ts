import { useLocalObservable } from 'mobx-react-lite';
import { DEFAULT_PAGE } from '../../../../shared/entities/car/model/types';
import type { PaginateCarsContract } from '../../../../shared/features/paginate-cars/model/contract';

export function usePaginateCars() {
  const store = useLocalObservable(() => {
    return {
      page: DEFAULT_PAGE.page,
      pageSize: DEFAULT_PAGE.pageSize,
      setPage(page: number) {
        this.page = page;
      },
      setPageSize(pageSize: number) {
        this.pageSize = pageSize;
      },
    };
  });
  return {
    page: store.page,
    pageSize: store.pageSize,
    // oxlint-disable-next-line typescript/unbound-method -- useLocalObservable binds methods
    setPage: store.setPage,
    // oxlint-disable-next-line typescript/unbound-method -- useLocalObservable binds methods
    setPageSize: store.setPageSize,
  };
}

const _typecheck: PaginateCarsContract = { usePaginateCars };
void _typecheck;
