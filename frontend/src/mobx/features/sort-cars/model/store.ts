import { makeAutoObservable } from 'mobx';
import {
  DEFAULT_SORT,
  type CarSortField,
  type SortOrder,
} from '../../../../shared/entities/car/model/types';
import type { SortCarsContract } from '../../../../shared/features/sort-cars/model/contract';

class SortCarsStore {
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

const sortCarsStore = new SortCarsStore();

export function useSortCars() {
  return {
    sortBy: sortCarsStore.sortBy,
    order: sortCarsStore.order,
    // oxlint-disable-next-line typescript/unbound-method -- autoBind: true (see constructor)
    setSort: sortCarsStore.setSort,
  };
}

const _typecheck: SortCarsContract = { useSortCars };
void _typecheck;
