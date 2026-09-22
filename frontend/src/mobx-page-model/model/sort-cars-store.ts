import { makeAutoObservable } from 'mobx';
import {
  DEFAULT_SORT,
  type CarSortField,
  type SortOrder,
} from '../../shared/entities/car/model/types';

export class SortCarsStore {
  sortBy: CarSortField = DEFAULT_SORT.sortBy;
  order: SortOrder = DEFAULT_SORT.order;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setSort(sortBy: CarSortField, order: SortOrder) {
    this.sortBy = sortBy;
    this.order = order;
  }
}
