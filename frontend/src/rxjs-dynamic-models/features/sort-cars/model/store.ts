import { useMemo } from 'react';
import { BehaviorSubject } from 'rxjs';
import {
  DEFAULT_SORT,
  type CarSortField,
  type SortOrder,
} from '../../../../shared/entities/car/model/types';
import type { SortCarsContract } from '../../../../shared/features/sort-cars/model/contract';
import { useBehaviorSubject } from '../../../../shared/lib/useBehaviorSubject';

export function useSortCars() {
  const sort$ = useMemo(() => {
    return new BehaviorSubject(DEFAULT_SORT);
  }, []);
  const sort = useBehaviorSubject(sort$);
  return {
    sortBy: sort.sortBy,
    order: sort.order,
    setSort: (sortBy: CarSortField, order: SortOrder) => {
      sort$.next({ sortBy, order });
    },
  };
}

const _typecheck: SortCarsContract = { useSortCars };
void _typecheck;
