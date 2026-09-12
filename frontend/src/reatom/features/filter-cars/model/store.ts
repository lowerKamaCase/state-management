import { atom } from '@reatom/core';
import { useAtom } from '@reatom/npm-react';
import {
  DEFAULT_FILTERS,
  type CarsFilters,
} from '../../../../shared/entities/car/model/types';
import type { FilterCarsContract } from '../../../../shared/features/filter-cars/model/contract';

const filtersAtom = atom<CarsFilters>(DEFAULT_FILTERS, 'filtersAtom');

export function useFilterCars() {
  const [filters, setFiltersAtom] = useAtom(filtersAtom);
  return {
    filters,
    setFilters: (patch: Partial<CarsFilters>) => {
      setFiltersAtom((s) => {
        return { ...s, ...patch };
      });
    },
    resetFilters: () => {
      setFiltersAtom(DEFAULT_FILTERS);
    },
  };
}

const _typecheck: FilterCarsContract = { useFilterCars };
void _typecheck;
