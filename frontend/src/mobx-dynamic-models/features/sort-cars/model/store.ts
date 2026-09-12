import { useLocalObservable } from 'mobx-react-lite';
import {
  DEFAULT_SORT,
  type CarSortField,
  type SortOrder,
} from '../../../../shared/entities/car/model/types';
import type { SortCarsContract } from '../../../../shared/features/sort-cars/model/contract';

export function useSortCars() {
  const store = useLocalObservable(() => {
    return {
      sortBy: DEFAULT_SORT.sortBy,
      order: DEFAULT_SORT.order,
      setSort(sortBy: CarSortField, order: SortOrder) {
        this.sortBy = sortBy;
        this.order = order;
      },
    };
  });
  return {
    sortBy: store.sortBy,
    order: store.order,
    // oxlint-disable-next-line typescript/unbound-method -- useLocalObservable binds methods
    setSort: store.setSort,
  };
}

const _typecheck: SortCarsContract = { useSortCars };
void _typecheck;
