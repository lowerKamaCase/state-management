import { createEvent, createStore } from 'effector';
import { useUnit } from 'effector-react';
import {
  DEFAULT_FILTERS,
  type CarsFilters,
} from '../../../../shared/entities/car/model/types';
import type { FilterCarsContract } from '../../../../shared/features/filter-cars/model/contract';

const filtersChanged = createEvent<Partial<CarsFilters>>();
const filtersReset = createEvent();

const $filters = createStore<CarsFilters>(DEFAULT_FILTERS)
  .on(filtersChanged, (s, patch) => {
    return { ...s, ...patch };
  })
  .reset(filtersReset);

export function useFilterCars() {
  const [filters, setFilters, resetFilters] = useUnit([
    $filters,
    filtersChanged,
    filtersReset,
  ]);
  return { filters, setFilters, resetFilters };
}

const _typecheck: FilterCarsContract = { useFilterCars };
void _typecheck;
