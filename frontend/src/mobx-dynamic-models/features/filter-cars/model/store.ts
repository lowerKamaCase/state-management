import { useLocalObservable } from 'mobx-react-lite';
import {
  DEFAULT_FILTERS,
  type CarsFilters,
} from '../../../../shared/entities/car/model/types';
import type { FilterCarsContract } from '../../../../shared/features/filter-cars/model/contract';

/**
 * useLocalObservable creates one observable object per component instance
 * (wrapping it the same way makeAutoObservable would, methods included) —
 * the local-store equivalent of the static variant's module-level
 * `new FilterCarsStore()` singleton.
 */
export function useFilterCars() {
  const store = useLocalObservable(() => {
    return {
      filters: DEFAULT_FILTERS as CarsFilters,
      setFilters(patch: Partial<CarsFilters>) {
        this.filters = { ...this.filters, ...patch };
      },
      resetFilters() {
        this.filters = DEFAULT_FILTERS;
      },
    };
  });
  return {
    filters: store.filters,
    // oxlint-disable-next-line typescript/unbound-method -- useLocalObservable binds methods
    setFilters: store.setFilters,
    // oxlint-disable-next-line typescript/unbound-method -- useLocalObservable binds methods
    resetFilters: store.resetFilters,
  };
}

const _typecheck: FilterCarsContract = { useFilterCars };
void _typecheck;
