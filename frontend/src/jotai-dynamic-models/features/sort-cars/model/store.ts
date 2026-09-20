import { atom, createStore, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import {
  DEFAULT_SORT,
  type CarSortField,
  type SortOrder,
} from '../../../../shared/entities/car/model/types';
import type { SortCarsContract } from '../../../../shared/features/sort-cars/model/contract';

function createSortCarsModel() {
  const store = createStore();
  const sortByAtom = atom<CarSortField>(DEFAULT_SORT.sortBy);
  const orderAtom = atom<SortOrder>(DEFAULT_SORT.order);

  const setSortAtom = atom(
    null,
    (_get, set, next: { sortBy: CarSortField; order: SortOrder }) => {
      set(sortByAtom, next.sortBy);
      set(orderAtom, next.order);
    },
  );

  return { store, sortByAtom, orderAtom, setSortAtom };
}

export function useSortCars() {
  const [model] = useState(() => {
    return createSortCarsModel();
  });
  const { store } = model;
  const sortBy = useAtomValue(model.sortByAtom, { store });
  const order = useAtomValue(model.orderAtom, { store });
  const setSortRaw = useSetAtom(model.setSortAtom, { store });
  const setSort = (nextSortBy: CarSortField, nextOrder: SortOrder) => {
    setSortRaw({ sortBy: nextSortBy, order: nextOrder });
  };
  return { sortBy, order, setSort };
}

const _typecheck: SortCarsContract = { useSortCars };
void _typecheck;
