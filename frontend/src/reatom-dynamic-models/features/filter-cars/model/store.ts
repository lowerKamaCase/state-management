import { useAtom } from '@reatom/npm-react';
import {
  DEFAULT_FILTERS,
  type CarsFilters,
} from '../../../../shared/entities/car/model/types';
import type { FilterCarsContract } from '../../../../shared/features/filter-cars/model/contract';

/**
 * Unlike the static variant (a module-level `atom(...)`, shared by every
 * mount), passing a plain value (instead of an existing atom) to useAtom
 * creates a fresh local atom scoped to this component instance — reatom's
 * own built-in equivalent of the useMemo/useState factory pattern used by
 * the other libraries' dynamic variants.
 */
export function useFilterCars() {
  const [filters, setFilters] = useAtom<CarsFilters>(DEFAULT_FILTERS, []);
  return {
    filters,
    setFilters: (patch: Partial<CarsFilters>) => {
      setFilters((s) => {
        return { ...s, ...patch };
      });
    },
    resetFilters: () => {
      setFilters(DEFAULT_FILTERS);
    },
  };
}

const _typecheck: FilterCarsContract = { useFilterCars };
void _typecheck;
