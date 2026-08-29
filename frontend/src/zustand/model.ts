import { useEffect } from 'react';
import { create } from 'zustand';
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

interface CarsState {
  params: CarsQueryParams;
  cars: Car[];
  meta: PaginatedMeta | null;
  isLoading: boolean;
  error: string | null;
  isMutating: boolean;
  fetchCars: () => Promise<void>;
  setFilters: (patch: Partial<CarsFilters>) => void;
  setSort: (sortBy: CarSortField, order: SortOrder) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  resetFilters: () => void;
  createCar: (input: CreateCarInput) => Promise<void>;
  updateCar: (id: string, input: UpdateCarInput) => Promise<void>;
  deleteCar: (id: string) => Promise<void>;
}

/**
 * The zustand store (created via `create()`) is a raw state-manager
 * primitive — it stays inside this factory closure and is never exported.
 * Only the adapter hooks returned below are part of this module's public
 * surface.
 */
function createCarsModel() {
  const useCarsStore = create<CarsState>((set, get) => {
    return {
      params: DEFAULT_QUERY_PARAMS,
      cars: [],
      meta: null,
      isLoading: false,
      error: null,
      isMutating: false,

      fetchCars: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await getCars(get().params);
          set({ cars: res.data, meta: res.meta, isLoading: false });
        } catch (e) {
          set({ error: (e as Error).message, isLoading: false });
        }
      },

      setFilters: (patch) => {
        set((s) => {
          return { params: { ...s.params, ...patch, page: 1 } };
        });
        void get().fetchCars();
      },
      setSort: (sortBy, order) => {
        set((s) => {
          return { params: { ...s.params, sortBy, order, page: 1 } };
        });
        void get().fetchCars();
      },
      setPage: (page) => {
        set((s) => {
          return { params: { ...s.params, page } };
        });
        void get().fetchCars();
      },
      setPageSize: (pageSize) => {
        set((s) => {
          return { params: { ...s.params, pageSize, page: 1 } };
        });
        void get().fetchCars();
      },
      resetFilters: () => {
        set({ params: DEFAULT_QUERY_PARAMS });
        void get().fetchCars();
      },

      createCar: async (input) => {
        set({ isMutating: true });
        try {
          await createCar(input);
          await get().fetchCars();
        } finally {
          set({ isMutating: false });
        }
      },
      updateCar: async (id, input) => {
        set({ isMutating: true });
        try {
          await updateCar(id, input);
          await get().fetchCars();
        } finally {
          set({ isMutating: false });
        }
      },
      deleteCar: async (id) => {
        set({ isMutating: true });
        try {
          await deleteCar(id);
          await get().fetchCars();
        } finally {
          set({ isMutating: false });
        }
      },
    };
  });

  function useCarsQueryState() {
    return {
      params: useCarsStore((s) => {
        return s.params;
      }),
      setFilters: useCarsStore((s) => {
        return s.setFilters;
      }),
      setSort: useCarsStore((s) => {
        return s.setSort;
      }),
      setPage: useCarsStore((s) => {
        return s.setPage;
      }),
      setPageSize: useCarsStore((s) => {
        return s.setPageSize;
      }),
      resetFilters: useCarsStore((s) => {
        return s.resetFilters;
      }),
    };
  }

  function useCars() {
    const cars = useCarsStore((s) => {
      return s.cars;
    });
    const meta = useCarsStore((s) => {
      return s.meta;
    });
    const isLoading = useCarsStore((s) => {
      return s.isLoading;
    });
    const error = useCarsStore((s) => {
      return s.error;
    });
    const fetchCars = useCarsStore((s) => {
      return s.fetchCars;
    });
    // Zustand has no reactive-effect system: every setter/mutation above
    // triggers its own refetch, but the very first load still needs an
    // explicit mount trigger — the only useEffect in this module.
    useEffect(() => {
      void fetchCars();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return {
      cars,
      meta: meta ?? undefined,
      isLoading,
      isFetching: isLoading,
      error,
      refetch: fetchCars,
    };
  }

  function useCreateCar() {
    const createCarAction = useCarsStore((s) => {
      return s.createCar;
    });
    const isPending = useCarsStore((s) => {
      return s.isMutating;
    });
    return { createCar: createCarAction, isPending, error: null };
  }

  function useUpdateCar() {
    const updateCarAction = useCarsStore((s) => {
      return s.updateCar;
    });
    const isPending = useCarsStore((s) => {
      return s.isMutating;
    });
    return { updateCar: updateCarAction, isPending, error: null };
  }

  function useDeleteCar() {
    const deleteCarAction = useCarsStore((s) => {
      return s.deleteCar;
    });
    const isPending = useCarsStore((s) => {
      return s.isMutating;
    });
    return { deleteCar: deleteCarAction, isPending, error: null };
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
