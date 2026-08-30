import { createEffect, createEvent, createStore, sample } from 'effector';
import { useUnit } from 'effector-react';
import { useEffect } from 'react';
import { getCars } from '../../../../shared/entities/car/api/carsApi';
import type { CarsListContract } from '../../../../shared/entities/car/model/contract';
import type {
  Car,
  CarsQueryParams,
  PaginatedMeta,
} from '../../../../shared/entities/car/model/types';

/**
 * Params live outside this module (composed by ui/CarsPage from the
 * filter/sort/paginate features), so React pushes them in via a private
 * `paramsChanged` event — the standard effector-react bridge for "external
 * state drives an effector store". Nothing but `useCarsList` leaves this
 * file: no store, event, or effect is exported, so no other module can
 * reach in and trigger this store's internals directly — a mutation
 * feature that needs a fresh list calls the `refetch()` this hook returns.
 */
const paramsChanged = createEvent<CarsQueryParams>();
const refreshRequested = createEvent();

const $params = createStore<CarsQueryParams | null>(null).on(
  paramsChanged,
  (_, params) => {
    return params;
  },
);

const fetchCarsFx = createEffect(getCars);

sample({
  clock: [paramsChanged, refreshRequested],
  source: $params,
  filter: (params): params is CarsQueryParams => {
    return params !== null;
  },
  target: fetchCarsFx,
});

const $cars = createStore<Car[]>([]).on(fetchCarsFx.doneData, (_, res) => {
  return res.data;
});
const $meta = createStore<PaginatedMeta | null>(null).on(
  fetchCarsFx.doneData,
  (_, res) => {
    return res.meta;
  },
);
const $isLoading = fetchCarsFx.pending;
const $listError = createStore<string | null>(null)
  .on(fetchCarsFx.failData, (_, e) => {
    return e.message;
  })
  .on(fetchCarsFx.done, () => {
    return null;
  });

export function useCarsList(params: CarsQueryParams) {
  const [cars, meta, isLoading, error] = useUnit([
    $cars,
    $meta,
    $isLoading,
    $listError,
  ]);
  useEffect(() => {
    paramsChanged(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);
  return {
    cars,
    meta: meta ?? undefined,
    isLoading,
    isFetching: isLoading,
    error,
    refetch: () => {
      refreshRequested();
    },
  };
}

const _typecheck: CarsListContract = { useCarsList };
void _typecheck;
