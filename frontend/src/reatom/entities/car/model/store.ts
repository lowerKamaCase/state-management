import { reatomAsync, withDataAtom, withErrorAtom } from '@reatom/async';
import { useAtom, useCtx } from '@reatom/npm-react';
import { useEffect } from 'react';
import { getCars } from '../../../../shared/entities/car/api/carsApi';
import type { CarsListContract } from '../../../../shared/entities/car/model/contract';
import type { CarsQueryParams } from '../../../../shared/entities/car/model/types';

/**
 * Nothing but useCarsList leaves this file — module-level singleton action,
 * shared by every mount. A mutation feature that needs a fresh list calls
 * the `refetch()` this hook returns.
 */
const fetchCarsFx = reatomAsync((_ctx, params: CarsQueryParams) => {
  return getCars(params);
}, 'fetchCarsFx').pipe(
  withDataAtom(),
  withErrorAtom((_ctx, e) => {
    return (e as Error).message;
  }),
);

let lastParams: CarsQueryParams | null = null;

export function useCarsList(params: CarsQueryParams) {
  const ctx = useCtx();
  const [data] = useAtom(fetchCarsFx.dataAtom);
  const [pending] = useAtom(fetchCarsFx.pendingAtom);
  const [error] = useAtom(fetchCarsFx.errorAtom);

  useEffect(() => {
    lastParams = params;
    void fetchCarsFx(ctx, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return {
    cars: data?.data ?? [],
    meta: data?.meta,
    isLoading: pending > 0,
    isFetching: pending > 0,
    error: error ?? null,
    refetch: () => {
      if (lastParams) {
        void fetchCarsFx(ctx, lastParams);
      }
    },
  };
}

const _typecheck: CarsListContract = { useCarsList };
void _typecheck;
