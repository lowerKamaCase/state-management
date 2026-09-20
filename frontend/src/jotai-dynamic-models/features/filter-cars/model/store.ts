import { atom, createStore, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import {
  DEFAULT_FILTERS,
  type CarsFilters,
} from '../../../../shared/entities/car/model/types';
import type { FilterCarsContract } from '../../../../shared/features/filter-cars/model/contract';

function createFilterCarsModel() {
  const store = createStore();
  const filtersAtom = atom<CarsFilters>(DEFAULT_FILTERS);

  const setFiltersAtom = atom(null, (get, set, patch: Partial<CarsFilters>) => {
    set(filtersAtom, { ...get(filtersAtom), ...patch });
  });

  const resetFiltersAtom = atom(null, (_get, set) => {
    set(filtersAtom, DEFAULT_FILTERS);
  });

  return { store, filtersAtom, setFiltersAtom, resetFiltersAtom };
}

export function useFilterCars() {
  const [model] = useState(() => {
    return createFilterCarsModel();
  });
  const { store } = model;
  const filters = useAtomValue(model.filtersAtom, { store });
  const setFilters = useSetAtom(model.setFiltersAtom, { store });
  const resetFilters = useSetAtom(model.resetFiltersAtom, { store });
  return { filters, setFilters, resetFilters };
}

const _typecheck: FilterCarsContract = { useFilterCars };
void _typecheck;
