import { makeAutoObservable, reaction, runInAction } from 'mobx';
import {
  createCar,
  deleteCar,
  getCars,
  updateCar,
} from '../shared/api/carsApi';
import {
  DEFAULT_QUERY_PARAMS,
  type Car,
  type CarsFilters,
  type CarSortField,
  type CarsQueryParams,
  type CreateCarInput,
  type PaginatedMeta,
  type SortOrder,
  type UpdateCarInput,
} from '../shared/types/car';
import type { CarsHooksContract } from '../shared/types/hooksContract';

/**
 * The MobX class instance is a raw state-manager primitive — it lives only
 * inside this factory closure and is never exported. Only the adapter hooks
 * returned below are part of this module's public surface.
 */
function createCarsModel() {
  class CarsStore {
    params: CarsQueryParams = DEFAULT_QUERY_PARAMS;
    cars: Car[] = [];
    meta: PaginatedMeta | null = null;
    isLoading = false;
    error: string | null = null;
    isMutating = false;

    constructor() {
      makeAutoObservable(this, {}, { autoBind: true });
      // Auto-refetch whenever params change (by reference), and once
      // immediately on construction — covers the "mount" case with no
      // useEffect needed anywhere in this module.
      reaction(
        () => {
          return this.params;
        },
        () => {
          void this.fetchCars();
        },
        { fireImmediately: true },
      );
    }

    async fetchCars() {
      this.isLoading = true;
      this.error = null;
      try {
        const res = await getCars(this.params);
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

    setFilters(patch: Partial<CarsFilters>) {
      this.params = { ...this.params, ...patch, page: 1 };
    }
    setSort(sortBy: CarSortField, order: SortOrder) {
      this.params = { ...this.params, sortBy, order, page: 1 };
    }
    setPage(page: number) {
      this.params = { ...this.params, page };
    }
    setPageSize(pageSize: number) {
      this.params = { ...this.params, pageSize, page: 1 };
    }
    resetFilters() {
      this.params = DEFAULT_QUERY_PARAMS;
    }

    async createCar(input: CreateCarInput) {
      this.isMutating = true;
      try {
        await createCar(input);
        await this.fetchCars();
      } finally {
        runInAction(() => {
          this.isMutating = false;
        });
      }
    }
    async updateCar(id: string, input: UpdateCarInput) {
      this.isMutating = true;
      try {
        await updateCar(id, input);
        await this.fetchCars();
      } finally {
        runInAction(() => {
          this.isMutating = false;
        });
      }
    }
    async deleteCar(id: string) {
      this.isMutating = true;
      try {
        await deleteCar(id);
        await this.fetchCars();
      } finally {
        runInAction(() => {
          this.isMutating = false;
        });
      }
    }
  }

  const carsStore = new CarsStore();

  function useCarsQueryState() {
    return {
      params: carsStore.params,
      setFilters: (patch: Partial<CarsFilters>) => {
        carsStore.setFilters(patch);
      },
      setSort: (sortBy: CarSortField, order: SortOrder) => {
        carsStore.setSort(sortBy, order);
      },
      setPage: (page: number) => {
        carsStore.setPage(page);
      },
      setPageSize: (pageSize: number) => {
        carsStore.setPageSize(pageSize);
      },
      resetFilters: () => {
        carsStore.resetFilters();
      },
    };
  }

  function useCars() {
    return {
      cars: carsStore.cars,
      meta: carsStore.meta ?? undefined,
      isLoading: carsStore.isLoading,
      isFetching: carsStore.isLoading,
      error: carsStore.error,
      refetch: () => {
        return void carsStore.fetchCars();
      },
    };
  }

  function useCreateCar() {
    return {
      createCar: (input: CreateCarInput) => {
        return carsStore.createCar(input);
      },
      isPending: carsStore.isMutating,
      error: null,
    };
  }

  function useUpdateCar() {
    return {
      updateCar: (id: string, input: UpdateCarInput) => {
        return carsStore.updateCar(id, input);
      },
      isPending: carsStore.isMutating,
      error: null,
    };
  }

  function useDeleteCar() {
    return {
      deleteCar: (id: string) => {
        return carsStore.deleteCar(id);
      },
      isPending: carsStore.isMutating,
      error: null,
    };
  }

  return {
    useCarsQueryState,
    useCars,
    useCreateCar,
    useUpdateCar,
    useDeleteCar,
  };
}

const model = createCarsModel();

export const useCarsQueryState = model.useCarsQueryState;
export const useCars = model.useCars;
export const useCreateCar = model.useCreateCar;
export const useUpdateCar = model.useUpdateCar;
export const useDeleteCar = model.useDeleteCar;

const _typecheck: CarsHooksContract = {
  useCarsQueryState,
  useCars,
  useCreateCar,
  useUpdateCar,
  useDeleteCar,
};
void _typecheck;
