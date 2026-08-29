import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useState } from 'react';
import {
  createCar,
  deleteCar,
  getCars,
  updateCar,
} from '../shared/api/carsApi';
import {
  DEFAULT_QUERY_PARAMS,
  type CarsFilters,
  type CarSortField,
  type CarsQueryParams,
  type CreateCarInput,
  type SortOrder,
  type UpdateCarInput,
} from '../shared/types/car';
import type { CarsHooksContract } from '../shared/types/hooksContract';

// React Query has no custom global store of its own (per the "just hooks"
// constraint) — there is no state-manager primitive to hide here, so these
// hooks are exported directly rather than via a factory closure.

export function useCarsQueryState() {
  const [params, setParams] = useState<CarsQueryParams>(DEFAULT_QUERY_PARAMS);
  return {
    params,
    setFilters: (patch: Partial<CarsFilters>) => {
      setParams((p) => {
        return { ...p, ...patch, page: 1 };
      });
    },
    setSort: (sortBy: CarSortField, order: SortOrder) => {
      setParams((p) => {
        return { ...p, sortBy, order, page: 1 };
      });
    },
    setPage: (page: number) => {
      setParams((p) => {
        return { ...p, page };
      });
    },
    setPageSize: (pageSize: number) => {
      setParams((p) => {
        return { ...p, pageSize, page: 1 };
      });
    },
    resetFilters: () => {
      setParams(DEFAULT_QUERY_PARAMS);
    },
  };
}

export function useCars(params: CarsQueryParams = DEFAULT_QUERY_PARAMS) {
  const query = useQuery({
    queryKey: ['cars', params],
    queryFn: () => {
      return getCars(params);
    },
    placeholderData: keepPreviousData,
  });
  return {
    cars: query.data?.data ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? (query.error as Error).message : null,
    refetch: () => {
      void query.refetch();
    },
  };
}

export function useCreateCar() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateCarInput) => {
      return createCar(input);
    },
    onSuccess: () => {
      return qc.invalidateQueries({ queryKey: ['cars'] });
    },
  });
  return {
    createCar: (input: CreateCarInput) => {
      return mutation.mutateAsync(input).then(() => {
        return undefined;
      });
    },
    isPending: mutation.isPending,
    error: mutation.error ? (mutation.error as Error).message : null,
  };
}

export function useUpdateCar() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (p: { id: string; input: UpdateCarInput }) => {
      return updateCar(p.id, p.input);
    },
    onSuccess: () => {
      return qc.invalidateQueries({ queryKey: ['cars'] });
    },
  });
  return {
    updateCar: (id: string, input: UpdateCarInput) => {
      return mutation.mutateAsync({ id, input }).then(() => {
        return undefined;
      });
    },
    isPending: mutation.isPending,
    error: mutation.error ? (mutation.error as Error).message : null,
  };
}

export function useDeleteCar() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return deleteCar(id);
    },
    onSuccess: () => {
      return qc.invalidateQueries({ queryKey: ['cars'] });
    },
  });
  return {
    deleteCar: (id: string) => {
      return mutation.mutateAsync(id).then(() => {
        return undefined;
      });
    },
    isPending: mutation.isPending,
    error: mutation.error ? (mutation.error as Error).message : null,
  };
}

const _typecheck: CarsHooksContract = {
  useCarsQueryState,
  useCars,
  useCreateCar,
  useUpdateCar,
  useDeleteCar,
};
void _typecheck;
