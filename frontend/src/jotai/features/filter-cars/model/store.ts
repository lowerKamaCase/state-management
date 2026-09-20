import { atom, useAtomValue, useSetAtom } from 'jotai';
import {
  DEFAULT_FILTERS,
  type CarsFilters,
} from '../../../../shared/entities/car/model/types';
import type { FilterCarsContract } from '../../../../shared/features/filter-cars/model/contract';

const filtersAtom = atom<CarsFilters>(DEFAULT_FILTERS);

const setFiltersAtom = atom(null, (get, set, patch: Partial<CarsFilters>) => {
  set(filtersAtom, { ...get(filtersAtom), ...patch });
});

const resetFiltersAtom = atom(null, (_get, set) => {
  set(filtersAtom, DEFAULT_FILTERS);
});

export function useFilterCars() {
  const filters = useAtomValue(filtersAtom);
  const setFilters = useSetAtom(setFiltersAtom);
  const resetFilters = useSetAtom(resetFiltersAtom);
  return { filters, setFilters, resetFilters };
}

const _typecheck: FilterCarsContract = { useFilterCars };
void _typecheck;
