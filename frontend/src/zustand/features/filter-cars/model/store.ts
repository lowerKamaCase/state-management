import { create } from 'zustand';
import {
  DEFAULT_FILTERS,
  type CarsFilters,
} from '../../../../shared/entities/car/model/types';
import type { FilterCarsContract } from '../../../../shared/features/filter-cars/model/contract';

interface FilterCarsState {
  filters: CarsFilters;
  setFilters: (patch: Partial<CarsFilters>) => void;
  resetFilters: () => void;
}

const useFilterCarsStore = create<FilterCarsState>((set) => {
  return {
    filters: DEFAULT_FILTERS,
    setFilters: (patch) => {
      set((s) => {
        return { filters: { ...s.filters, ...patch } };
      });
    },
    resetFilters: () => {
      set({ filters: DEFAULT_FILTERS });
    },
  };
});

export function useFilterCars() {
  const filters = useFilterCarsStore((s) => {
    return s.filters;
  });
  const setFilters = useFilterCarsStore((s) => {
    return s.setFilters;
  });
  const resetFilters = useFilterCarsStore((s) => {
    return s.resetFilters;
  });
  return { filters, setFilters, resetFilters };
}

const _typecheck: FilterCarsContract = { useFilterCars };
void _typecheck;
