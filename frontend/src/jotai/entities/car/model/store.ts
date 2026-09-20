import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { getCars } from '../../../../shared/entities/car/api/carsApi';
import type { CarsListContract } from '../../../../shared/entities/car/model/contract';
import type {
  Car,
  CarsQueryParams,
  PaginatedMeta,
} from '../../../../shared/entities/car/model/types';

/**
 * Atoms never leave this file — only `useCarsList` is exported, so no other
 * module can reach in and write to them directly. Atom configs hold no
 * values themselves: with no Provider, values live in the default store of
 * Jotai, which makes these module-level atoms a singleton, like the static
 * variants of the other managers.
 */
const carsAtom = atom<Car[]>([]);
const metaAtom = atom<PaginatedMeta | null>(null);
const isLoadingAtom = atom(false);
const errorAtom = atom<string | null>(null);

const fetchCarsAtom = atom(null, async (_get, set, params: CarsQueryParams) => {
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
});

export function useCarsList(params: CarsQueryParams) {
  const cars = useAtomValue(carsAtom);
  const meta = useAtomValue(metaAtom);
  const isLoading = useAtomValue(isLoadingAtom);
  const error = useAtomValue(errorAtom);
  const fetchCars = useSetAtom(fetchCarsAtom);
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
