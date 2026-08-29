/**
 * Compile-time-only contract. Not imported at runtime (hooks must be called
 * directly per rules-of-hooks) — each state-manager folder's hooks.ts ends
 * with a throwaway `const _typecheck: CarsHooksContract = {...}` assignment
 * to get the compiler to enforce parity across all four implementations.
 */
import type {
  Car,
  CarsFilters,
  CarSortField,
  CarsQueryParams,
  CreateCarInput,
  PaginatedMeta,
  SortOrder,
  UpdateCarInput,
} from './car';

export interface CarsQueryStateResult {
  params: CarsQueryParams;
  setFilters: (patch: Partial<CarsFilters>) => void;
  setSort: (sortBy: CarSortField, order: SortOrder) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  resetFilters: () => void;
}

export interface CarsListResult {
  cars: Car[];
  meta: PaginatedMeta | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  refetch: () => void;
}

export interface CarsHooksContract {
  useCarsQueryState: () => CarsQueryStateResult;
  useCars: (params?: CarsQueryParams) => CarsListResult;
  useCreateCar: () => {
    createCar: (input: CreateCarInput) => Promise<void>;
    isPending: boolean;
    error: string | null;
  };
  useUpdateCar: () => {
    updateCar: (id: string, input: UpdateCarInput) => Promise<void>;
    isPending: boolean;
    error: string | null;
  };
  useDeleteCar: () => {
    deleteCar: (id: string) => Promise<void>;
    isPending: boolean;
    error: string | null;
  };
}
