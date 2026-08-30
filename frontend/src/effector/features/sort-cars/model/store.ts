import { createEvent, createStore } from 'effector';
import { useUnit } from 'effector-react';
import {
  DEFAULT_SORT,
  type CarSortField,
  type SortOrder,
} from '../../../../shared/entities/car/model/types';
import type { SortCarsContract } from '../../../../shared/features/sort-cars/model/contract';

const sortChanged = createEvent<{ sortBy: CarSortField; order: SortOrder }>();

const $sort = createStore(DEFAULT_SORT).on(sortChanged, (_, sort) => {
  return sort;
});

export function useSortCars() {
  const [sort, setSortRaw] = useUnit([$sort, sortChanged]);
  return {
    sortBy: sort.sortBy,
    order: sort.order,
    setSort: (sortBy: CarSortField, order: SortOrder) => {
      setSortRaw({ sortBy, order });
    },
  };
}

const _typecheck: SortCarsContract = { useSortCars };
void _typecheck;
