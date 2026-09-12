import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { getCars } from '../../../../shared/entities/car/api/carsApi';
import type { CarsListContract } from '../../../../shared/entities/car/model/contract';
import type {
  Car,
  CarsQueryParams,
  PaginatedMeta,
} from '../../../../shared/entities/car/model/types';

interface CarsListState {
  cars: Car[];
  meta: PaginatedMeta | null;
  isLoading: boolean;
  error: string | null;
  fetchCars: (params: CarsQueryParams) => Promise<void>;
}

/**
 * Unlike the static variant (one `create()` call at module scope, shared by
 * every mount of this hook), this factory is called fresh per component
 * instance via useState — each mount gets its own store instance, so two
 * CarsList consumers on the same page never share state. The store itself
 * never leaves this file — only `useCarsList` is exported, so no other
 * module can reach in and call `fetchCars` directly. A mutation feature
 * that needs a fresh list calls the `refetch()` this hook returns.
 */
function createCarsListStore() {
  return create<CarsListState>((set) => {
    return {
      cars: [],
      meta: null,
      isLoading: false,
      error: null,
      fetchCars: async (params) => {
        set({ isLoading: true, error: null });
        try {
          const res = await getCars(params);
          set({ cars: res.data, meta: res.meta, isLoading: false });
        } catch (e) {
          set({ error: (e as Error).message, isLoading: false });
        }
      },
    };
  });
}

export function useCarsList(params: CarsQueryParams) {
  const [useCarsListStore] = useState(() => {
    return createCarsListStore();
  });
  const cars = useCarsListStore((s) => {
    return s.cars;
  });
  const meta = useCarsListStore((s) => {
    return s.meta;
  });
  const isLoading = useCarsListStore((s) => {
    return s.isLoading;
  });
  const error = useCarsListStore((s) => {
    return s.error;
  });
  const fetchCars = useCarsListStore((s) => {
    return s.fetchCars;
  });
  useEffect(() => {
    void fetchCars(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);
  return {
    cars,
    meta: meta ?? undefined,
    isLoading,
    isFetching: isLoading,
    error,
    refetch: () => {
      void fetchCars(params);
    },
  };
}

const _typecheck: CarsListContract = { useCarsList };
void _typecheck;
