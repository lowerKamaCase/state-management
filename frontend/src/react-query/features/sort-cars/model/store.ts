import { useState } from 'react';
import {
  DEFAULT_SORT,
  type CarSortField,
  type SortOrder,
} from '../../../../shared/entities/car/model/types';
import type { SortCarsContract } from '../../../../shared/features/sort-cars/model/contract';

export function useSortCars() {
  const [sort, setSortState] = useState(DEFAULT_SORT);
  return {
    sortBy: sort.sortBy,
    order: sort.order,
    setSort: (sortBy: CarSortField, order: SortOrder) => {
      setSortState({ sortBy, order });
    },
  };
}

const _typecheck: SortCarsContract = { useSortCars };
void _typecheck;
