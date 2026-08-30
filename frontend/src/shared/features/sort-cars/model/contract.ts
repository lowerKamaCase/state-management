import type {
  CarSortField,
  SortOrder,
} from '../../../entities/car/model/types';

export interface SortCarsResult {
  sortBy: CarSortField;
  order: SortOrder;
  setSort: (sortBy: CarSortField, order: SortOrder) => void;
}

export interface SortCarsContract {
  useSortCars: () => SortCarsResult;
}
