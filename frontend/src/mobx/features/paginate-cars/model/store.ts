import { makeAutoObservable } from 'mobx';
import { DEFAULT_PAGE } from '../../../../shared/entities/car/model/types';
import type { PaginateCarsContract } from '../../../../shared/features/paginate-cars/model/contract';

class PaginateCarsStore {
  page = DEFAULT_PAGE.page;
  pageSize = DEFAULT_PAGE.pageSize;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setPage(page: number) {
    this.page = page;
  }

  setPageSize(pageSize: number) {
    this.pageSize = pageSize;
  }
}

const paginateCarsStore = new PaginateCarsStore();

export function usePaginateCars() {
  return {
    page: paginateCarsStore.page,
    pageSize: paginateCarsStore.pageSize,
    // oxlint-disable-next-line typescript/unbound-method -- autoBind: true (see constructor)
    setPage: paginateCarsStore.setPage,
    // oxlint-disable-next-line typescript/unbound-method -- autoBind: true (see constructor)
    setPageSize: paginateCarsStore.setPageSize,
  };
}

const _typecheck: PaginateCarsContract = { usePaginateCars };
void _typecheck;
