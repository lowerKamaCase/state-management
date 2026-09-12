import { createEffect, createEvent, createStore, sample } from 'effector';
import { useUnit } from 'effector-react';
import { useEffect, useMemo } from 'react';
import { getCars } from '../../../../shared/entities/car/api/carsApi';
import type { CarsListContract } from '../../../../shared/entities/car/model/contract';
import type {
  Car,
  CarsQueryParams,
  PaginatedMeta,
} from '../../../../shared/entities/car/model/types';

/**
 * Unlike the static variant (module-level singleton units, created once
 * when the module first loads and shared by every mount of this hook),
 * this factory is called fresh per component instance via useMemo — each
 * mount gets its own isolated graph of units, so two CarsList consumers on
 * the same page never share state. effector doesn't care where a unit was
 * created; useUnit subscribes to whatever store/event reference it's given.
 */
function createCarsListModel() {
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

  return {
    paramsChanged,
    refreshRequested,
    $cars,
    $meta,
    $isLoading,
    $listError,
  };
}

export function useCarsList(params: CarsQueryParams) {
  const model = useMemo(() => {
    return createCarsListModel();
  }, []);
  const [cars, meta, isLoading, error] = useUnit([
    model.$cars,
    model.$meta,
    model.$isLoading,
    model.$listError,
  ]);
  useEffect(() => {
    model.paramsChanged(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);
  return {
    cars,
    meta: meta ?? undefined,
    isLoading,
    isFetching: isLoading,
    error,
    refetch: () => {
      model.refreshRequested();
    },
  };
}

const _typecheck: CarsListContract = { useCarsList };
void _typecheck;
