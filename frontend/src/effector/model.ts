import { useEffect } from 'react';
import { createStore, createEvent, createEffect, sample } from 'effector';
import { useUnit } from 'effector-react';
import { getCars, createCar, updateCar, deleteCar } from '../shared/api/carsApi';
import { DEFAULT_QUERY_PARAMS } from '../shared/types/car';
import type {
  Car,
  CarsFilters,
  CarSortField,
  SortOrder,
  CarsQueryParams,
  PaginatedMeta,
  CreateCarInput,
  UpdateCarInput,
} from '../shared/types/car';
import type { CarsHooksContract } from '../shared/types/hooksContract';

/**
 * Everything effector-specific (stores/events/effects) is created and kept
 * inside this factory closure — never exported. The only public surface of
 * this module is the hook functions returned below, so nothing outside this
 * file can ever touch a raw effector unit.
 */
function createCarsModel() {
  const filtersChanged = createEvent<Partial<CarsFilters>>();
  const sortChanged = createEvent<{ sortBy: CarSortField; order: SortOrder }>();
  const pageChanged = createEvent<number>();
  const pageSizeChanged = createEvent<number>();
  const filtersReset = createEvent();
  const refreshRequested = createEvent();

  const fetchCarsFx = createEffect(getCars);
  const createCarFx = createEffect((input: CreateCarInput) => createCar(input));
  const updateCarFx = createEffect((p: { id: string; input: UpdateCarInput }) => updateCar(p.id, p.input));
  const deleteCarFx = createEffect((id: string) => deleteCar(id));

  const $queryParams = createStore<CarsQueryParams>(DEFAULT_QUERY_PARAMS)
    .on(filtersChanged, (s, patch) => ({ ...s, ...patch, page: 1 }))
    .on(sortChanged, (s, { sortBy, order }) => ({ ...s, sortBy, order, page: 1 }))
    .on(pageChanged, (s, page) => ({ ...s, page }))
    .on(pageSizeChanged, (s, pageSize) => ({ ...s, pageSize, page: 1 }))
    .reset(filtersReset);

  const $cars = createStore<Car[]>([]).on(fetchCarsFx.doneData, (_, res) => res.data);
  const $meta = createStore<PaginatedMeta | null>(null).on(fetchCarsFx.doneData, (_, res) => res.meta);
  const $isLoading = fetchCarsFx.pending;
  const $listError = createStore<string | null>(null)
    .on(fetchCarsFx.failData, (_, e) => e.message)
    .on(fetchCarsFx.done, () => null);

  // Refetch with the latest params after any param change, on mount
  // (via refreshRequested), or after any mutation succeeds.
  sample({
    clock: [
      filtersChanged,
      sortChanged,
      pageChanged,
      pageSizeChanged,
      filtersReset,
      refreshRequested,
      createCarFx.done,
      updateCarFx.done,
      deleteCarFx.done,
    ],
    source: $queryParams,
    target: fetchCarsFx,
  });

  function useCarsQueryState() {
    const [params, setFilters, setSortRaw, setPage, setPageSize, resetFilters] = useUnit([
      $queryParams,
      filtersChanged,
      sortChanged,
      pageChanged,
      pageSizeChanged,
      filtersReset,
    ]);
    return {
      params,
      setFilters,
      setSort: (sortBy: CarSortField, order: SortOrder) => setSortRaw({ sortBy, order }),
      setPage,
      setPageSize,
      resetFilters,
    };
  }

  function useCars() {
    const [cars, meta, isLoading, error, refresh] = useUnit([
      $cars,
      $meta,
      $isLoading,
      $listError,
      refreshRequested,
    ]);
    useEffect(() => {
      refresh();
    }, [refresh]);
    return { cars, meta: meta ?? undefined, isLoading, isFetching: isLoading, error, refetch: refresh };
  }

  function useCreateCar() {
    const [run, isPending] = useUnit([createCarFx, createCarFx.pending]);
    return { createCar: (input: CreateCarInput) => run(input).then(() => undefined), isPending, error: null };
  }

  function useUpdateCar() {
    const [run, isPending] = useUnit([updateCarFx, updateCarFx.pending]);
    return {
      updateCar: (id: string, input: UpdateCarInput) => run({ id, input }).then(() => undefined),
      isPending,
      error: null,
    };
  }

  function useDeleteCar() {
    const [run, isPending] = useUnit([deleteCarFx, deleteCarFx.pending]);
    return { deleteCar: (id: string) => run(id).then(() => undefined), isPending, error: null };
  }

  return { useCarsQueryState, useCars, useCreateCar, useUpdateCar, useDeleteCar };
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
