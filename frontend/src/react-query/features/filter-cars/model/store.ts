import { useState } from 'react';
import {
  DEFAULT_FILTERS,
  type CarsFilters,
} from '../../../../shared/entities/car/model/types';
import type { FilterCarsContract } from '../../../../shared/features/filter-cars/model/contract';

export function useFilterCars() {
  const [filters, setFiltersState] = useState<CarsFilters>(DEFAULT_FILTERS);
  return {
    filters,
    setFilters: (patch: Partial<CarsFilters>) => {
      setFiltersState((s) => {
        return { ...s, ...patch };
      });
    },
    resetFilters: () => {
      setFiltersState(DEFAULT_FILTERS);
    },
  };
}

const _typecheck: FilterCarsContract = { useFilterCars };
void _typecheck;
