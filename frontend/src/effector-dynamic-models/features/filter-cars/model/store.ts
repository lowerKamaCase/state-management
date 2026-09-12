import { createEvent, createStore } from 'effector';
import { useUnit } from 'effector-react';
import { useMemo } from 'react';
import {
  DEFAULT_FILTERS,
  type CarsFilters,
} from '../../../../shared/entities/car/model/types';
import type { FilterCarsContract } from '../../../../shared/features/filter-cars/model/contract';

function createFilterCarsModel() {
  const filtersChanged = createEvent<Partial<CarsFilters>>();
  const filtersReset = createEvent();

  const $filters = createStore<CarsFilters>(DEFAULT_FILTERS)
    .on(filtersChanged, (s, patch) => {
      return { ...s, ...patch };
    })
    .reset(filtersReset);

  return { $filters, filtersChanged, filtersReset };
}

export function useFilterCars() {
  const model = useMemo(() => {
    return createFilterCarsModel();
  }, []);
  const [filters, setFilters, resetFilters] = useUnit([
    model.$filters,
    model.filtersChanged,
    model.filtersReset,
  ]);
  return { filters, setFilters, resetFilters };
}

const _typecheck: FilterCarsContract = { useFilterCars };
void _typecheck;
