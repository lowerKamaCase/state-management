import {
  createEffect,
  createStore,
  sample,
  type Store,
  type Unit,
} from 'effector';
import { getCars } from '../../shared/entities/car/api/carsApi';
import type {
  Car,
  CarsQueryParams,
  PaginatedMeta,
} from '../../shared/entities/car/model/types';

export function createCarsListModel(
  $queryParams: Store<CarsQueryParams>,
  refreshClock: Unit<unknown>[],
) {
  const fetchCarsFx = createEffect(getCars);

  sample({ clock: refreshClock, source: $queryParams, target: fetchCarsFx });

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

  return { $cars, $meta, $isLoading, $listError, fetchCarsFx };
}
