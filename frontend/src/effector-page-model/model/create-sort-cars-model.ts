import { createEvent, createStore } from 'effector';
import {
  DEFAULT_SORT,
  type CarSortField,
  type SortOrder,
} from '../../shared/entities/car/model/types';

export function createSortCarsModel() {
  const sortChanged = createEvent<{ sortBy: CarSortField; order: SortOrder }>();

  const $sort = createStore(DEFAULT_SORT).on(sortChanged, (_, sort) => {
    return sort;
  });

  return { $sort, sortChanged };
}
