import { atom, useAtomValue, useSetAtom } from 'jotai';
import {
  DEFAULT_SORT,
  type CarSortField,
  type SortOrder,
} from '../../../../shared/entities/car/model/types';
import type { SortCarsContract } from '../../../../shared/features/sort-cars/model/contract';

const sortByAtom = atom<CarSortField>(DEFAULT_SORT.sortBy);
const orderAtom = atom<SortOrder>(DEFAULT_SORT.order);

const setSortAtom = atom(
  null,
  (_get, set, next: { sortBy: CarSortField; order: SortOrder }) => {
    set(sortByAtom, next.sortBy);
    set(orderAtom, next.order);
  },
);

export function useSortCars() {
  const sortBy = useAtomValue(sortByAtom);
  const order = useAtomValue(orderAtom);
  const setSortRaw = useSetAtom(setSortAtom);
  const setSort = (nextSortBy: CarSortField, nextOrder: SortOrder) => {
    setSortRaw({ sortBy: nextSortBy, order: nextOrder });
  };
  return { sortBy, order, setSort };
}

const _typecheck: SortCarsContract = { useSortCars };
void _typecheck;
