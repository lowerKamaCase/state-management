import { makeAutoObservable } from 'mobx';
import {
  DEFAULT_FILTERS,
  type CarsFilters,
} from '../../shared/entities/car/model/types';

export class FilterCarsStore {
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
