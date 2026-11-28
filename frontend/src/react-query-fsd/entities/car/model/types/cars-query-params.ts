import type { CarSortField } from './car-sort-field';
import type { CarsFilters } from './cars-filters';
import type { SortOrder } from './sort-order';

export interface CarsQueryParams {
  filters: CarsFilters;
  sortBy: CarSortField;
  order: SortOrder;
  page: number;
  pageSize: number;
}
