import { makeAutoObservable } from 'mobx';
import { DEFAULT_PAGE } from '../../shared/entities/car/model/types';

export class PaginateCarsStore {
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
