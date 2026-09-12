import { useState } from 'react';
import { create } from 'zustand';
import {
  DEFAULT_SORT,
  type CarSortField,
  type SortOrder,
} from '../../../../shared/entities/car/model/types';
import type { SortCarsContract } from '../../../../shared/features/sort-cars/model/contract';

interface SortCarsState {
  sortBy: CarSortField;
  order: SortOrder;
  setSort: (sortBy: CarSortField, order: SortOrder) => void;
}

function createSortCarsStore() {
  return create<SortCarsState>((set) => {
    return {
      ...DEFAULT_SORT,
      setSort: (sortBy, order) => {
        set({ sortBy, order });
      },
    };
  });
}

export function useSortCars() {
  const [useSortCarsStore] = useState(() => {
    return createSortCarsStore();
  });
  const sortBy = useSortCarsStore((s) => {
    return s.sortBy;
  });
  const order = useSortCarsStore((s) => {
    return s.order;
  });
  const setSort = useSortCarsStore((s) => {
    return s.setSort;
  });
  return { sortBy, order, setSort };
}

const _typecheck: SortCarsContract = { useSortCars };
void _typecheck;
