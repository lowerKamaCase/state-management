import { atom } from '@reatom/core';
import { useAtom } from '@reatom/npm-react';
import {
  DEFAULT_SORT,
  type CarSortField,
  type SortOrder,
} from '../../../../shared/entities/car/model/types';
import type { SortCarsContract } from '../../../../shared/features/sort-cars/model/contract';

const sortAtom = atom(DEFAULT_SORT, 'sortAtom');

export function useSortCars() {
  const [sort, setSortAtom] = useAtom(sortAtom);
  return {
    sortBy: sort.sortBy,
    order: sort.order,
    setSort: (sortBy: CarSortField, order: SortOrder) => {
      setSortAtom({ sortBy, order });
    },
  };
}

const _typecheck: SortCarsContract = { useSortCars };
void _typecheck;
