import { makeAutoObservable } from 'mobx';
import {
  DEFAULT_FILTERS,
  type CarsFilters,
} from '../../../../shared/entities/car/model/types';
import type { FilterCarsContract } from '../../../../shared/features/filter-cars/model/contract';

class FilterCarsStore {
  filters: CarsFilters = DEFAULT_FILTERS;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setFilters(patch: Partial<CarsFilters>) {
    this.filters = { ...this.filters, ...patch };
  }

  resetFilters() {
    this.filters = DEFAULT_FILTERS;
  }
}

const filterCarsStore = new FilterCarsStore();

export function useFilterCars() {
  return {
    filters: filterCarsStore.filters,
    // oxlint-disable-next-line typescript/unbound-method -- autoBind: true (see constructor)
    setFilters: filterCarsStore.setFilters,
    // oxlint-disable-next-line typescript/unbound-method -- autoBind: true (see constructor)
    resetFilters: filterCarsStore.resetFilters,
  };
}

const _typecheck: FilterCarsContract = { useFilterCars };
void _typecheck;
