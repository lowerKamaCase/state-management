import { makeAutoObservable, runInAction } from 'mobx';
import { useEffect, useState } from 'react';
import { getCars } from '../../../../shared/entities/car/api/carsApi';
import type { CarsListContract } from '../../../../shared/entities/car/model/contract';
import type {
  Car,
  CarsQueryParams,
  PaginatedMeta,
} from '../../../../shared/entities/car/model/types';

/**
 * Unlike the static variant (one `new CarsListStore()` at module scope,
 * shared by every mount of this hook), the instance is created fresh per
 * component via `useState(() => new CarsListStore())` — each mount gets its
 * own store, so two CarsList consumers on the same page never share state.
 * The instance never leaves this file — only `useCarsList` is exported, so
 * no other module can reach in and call `fetchCars` directly. A mutation
 * feature that needs a fresh list calls the `refetch()` this hook returns.
 */
class CarsListStore {
  cars: Car[] = [];
  meta: PaginatedMeta | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchCars(params: CarsQueryParams) {
    this.isLoading = true;
    this.error = null;
    try {
      const res = await getCars(params);
      runInAction(() => {
        this.cars = res.data;
        this.meta = res.meta;
        this.isLoading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.error = (e as Error).message;
        this.isLoading = false;
      });
    }
  }
}

export function useCarsList(params: CarsQueryParams) {
  const [carsListStore] = useState(() => {
    return new CarsListStore();
  });
  useEffect(() => {
    void carsListStore.fetchCars(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);
  return {
    cars: carsListStore.cars,
    meta: carsListStore.meta ?? undefined,
    isLoading: carsListStore.isLoading,
    isFetching: carsListStore.isLoading,
    error: carsListStore.error,
    refetch: () => {
      void carsListStore.fetchCars(params);
    },
  };
}

const _typecheck: CarsListContract = { useCarsList };
void _typecheck;
