import { makeAutoObservable, runInAction } from 'mobx';
import { useEffect } from 'react';
import { getCars } from '../../../../shared/entities/car/api/carsApi';
import type { CarsListContract } from '../../../../shared/entities/car/model/contract';
import type {
  Car,
  CarsQueryParams,
  PaginatedMeta,
} from '../../../../shared/entities/car/model/types';

/**
 * The store instance never leaves this file — only `useCarsList` is
 * exported, so no other module can reach in and call `fetchCars` directly.
 * A mutation feature that needs a fresh list calls the `refetch()` this
 * hook returns.
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

const carsListStore = new CarsListStore();

export function useCarsList(params: CarsQueryParams) {
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
