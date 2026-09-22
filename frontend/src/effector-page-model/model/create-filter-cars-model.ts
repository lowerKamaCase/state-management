import { createEvent, createStore } from 'effector';
import {
  DEFAULT_FILTERS,
  type CarsFilters,
} from '../../shared/entities/car/model/types';

export function createFilterCarsModel() {
  const filtersChanged = createEvent<Partial<CarsFilters>>();
  const filtersReset = createEvent();

  const $filters = createStore<CarsFilters>(DEFAULT_FILTERS)
    .on(filtersChanged, (s, patch) => {
      return { ...s, ...patch };
    })
    .reset(filtersReset);

  return { $filters, filtersChanged, filtersReset };
}
