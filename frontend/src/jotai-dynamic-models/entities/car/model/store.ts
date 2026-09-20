import { atom, createStore, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { getCars } from '../../../../shared/entities/car/api/carsApi';
import type { CarsListContract } from '../../../../shared/entities/car/model/contract';
import type {
  Car,
  CarsQueryParams,
  PaginatedMeta,
} from '../../../../shared/entities/car/model/types';

/**
 * Unlike the static variant (module-level atoms living in the default store,
 * shared by every mount of this hook), this factory is called fresh per
 * component instance via useState — each mount gets its own store and its
 * own atoms, so two CarsList consumers on the same page never share state.
 * The atoms never leave this file — only `useCarsList` is exported. A
 * mutation feature that needs a fresh list calls the `refetch()` this hook
 * returns.
 */
function createCarsListModel() {
  const store = createStore();
  const carsAtom = atom<Car[]>([]);
  const metaAtom = atom<PaginatedMeta | null>(null);
  const isLoadingAtom = atom(false);
  const errorAtom = atom<string | null>(null);

  const fetchCarsAtom = atom(
    null,
    async (_get, set, params: CarsQueryParams) => {
      set(isLoadingAtom, true);
      set(errorAtom, null);
      try {
        const res = await getCars(params);
        set(carsAtom, res.data);
        set(metaAtom, res.meta);
      } catch (e) {
        set(errorAtom, (e as Error).message);
      } finally {
        set(isLoadingAtom, false);
      }
    },
  );

  return { store, carsAtom, metaAtom, isLoadingAtom, errorAtom, fetchCarsAtom };
}

export function useCarsList(params: CarsQueryParams) {
  const [model] = useState(() => {
    return createCarsListModel();
  });
  const { store } = model;
  const cars = useAtomValue(model.carsAtom, { store });
  const meta = useAtomValue(model.metaAtom, { store });
  const isLoading = useAtomValue(model.isLoadingAtom, { store });
  const error = useAtomValue(model.errorAtom, { store });
  const fetchCars = useSetAtom(model.fetchCarsAtom, { store });
  useEffect(() => {
    void fetchCars(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);
  return {
    cars,
    meta: meta ?? undefined,
    isLoading,
    isFetching: isLoading,
    error,
    refetch: () => {
      void fetchCars(params);
    },
  };
}

const _typecheck: CarsListContract = { useCarsList };
void _typecheck;
