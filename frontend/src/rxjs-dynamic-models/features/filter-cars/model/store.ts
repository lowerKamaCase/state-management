import { useMemo } from 'react';
import { BehaviorSubject } from 'rxjs';
import {
  DEFAULT_FILTERS,
  type CarsFilters,
} from '../../../../shared/entities/car/model/types';
import type { FilterCarsContract } from '../../../../shared/features/filter-cars/model/contract';
import { useBehaviorSubject } from '../../../../shared/lib/useBehaviorSubject';

export function useFilterCars() {
  const filters$ = useMemo(() => {
    return new BehaviorSubject<CarsFilters>(DEFAULT_FILTERS);
  }, []);
  const filters = useBehaviorSubject(filters$);
  return {
    filters,
    setFilters: (patch: Partial<CarsFilters>) => {
      filters$.next({ ...filters$.getValue(), ...patch });
    },
    resetFilters: () => {
      filters$.next(DEFAULT_FILTERS);
    },
  };
}

const _typecheck: FilterCarsContract = { useFilterCars };
void _typecheck;
