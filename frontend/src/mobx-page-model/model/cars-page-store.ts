import { makeAutoObservable, reaction } from 'mobx';
import type {
  CarsFilters,
  CarSortField,
  CarsQueryParams,
  SortOrder,
} from '../../shared/entities/car/model/types';
import { CarsListStore } from './cars-list-store';
import { FilterCarsStore } from './filter-cars-store';
import { PaginateCarsStore } from './paginate-cars-store';
import { SortCarsStore } from './sort-cars-store';

/**
 * The wrapper factory: instantiates the four stores above and wires them
 * together. Filters, sort, pagination and the list fetch are not
 * independent features — they are facets of the same "browse the list"
 * concern, split into separate stores only for reuse. setFilters/
 * resetFilters/setSort reach into paginateStore after calling the matching
 * sub-store's own method — that's what makes this a wrapper rather than
 * one feature importing another; no individual store above knows the
 * other three exist.
 */
export class CarsPageStore {
  readonly filterStore = new FilterCarsStore();
  readonly sortStore = new SortCarsStore();
  readonly paginateStore = new PaginateCarsStore();
  readonly listStore = new CarsListStore();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    reaction(
      () => {
        return this.queryParams;
      },
      () => {
        void this.listStore.fetchCars(this.queryParams);
      },
      { fireImmediately: true },
    );
  }

  get queryParams(): CarsQueryParams {
    return {
      ...this.filterStore.filters,
      sortBy: this.sortStore.sortBy,
      order: this.sortStore.order,
      page: this.paginateStore.page,
      pageSize: this.paginateStore.pageSize,
    };
  }

  // Wrapper callbacks: call the matching sub-store method, then reach into
  // paginateStore to reset the page — this is the composition point, kept
  // out of both the sub-stores and the component.
  setFilters(patch: Partial<CarsFilters>) {
    this.filterStore.setFilters(patch);
    this.paginateStore.setPage(1);
  }

  resetFilters() {
    this.filterStore.resetFilters();
    this.paginateStore.setPage(1);
  }

  setSort(sortBy: CarSortField, order: SortOrder) {
    this.sortStore.setSort(sortBy, order);
    this.paginateStore.setPage(1);
  }
}
