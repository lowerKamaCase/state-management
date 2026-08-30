import type { CarsFilters } from '../../../entities/car/model/types';

export interface FilterCarsResult {
  filters: CarsFilters;
  setFilters: (patch: Partial<CarsFilters>) => void;
  resetFilters: () => void;
}

export interface FilterCarsContract {
  useFilterCars: () => FilterCarsResult;
}
