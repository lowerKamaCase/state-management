import { reatomAsync, withDataAtom, withErrorAtom } from '@reatom/async';
import { useAtom, useCtx } from '@reatom/npm-react';
import { useEffect, useMemo } from 'react';
import { getCars } from '../../../../shared/entities/car/api/carsApi';
import type { CarsListContract } from '../../../../shared/entities/car/model/contract';
import type { CarsQueryParams } from '../../../../shared/entities/car/model/types';

/**
 * Unlike the static variant (a module-level singleton action, shared by
 * every mount), this factory is called fresh per component instance via
 * useMemo — each mount gets its own action, so two CarsList consumers on
 * the same page never share state.
 */
function createCarsListModel() {
  const fetchCarsFx = reatomAsync((_ctx, params: CarsQueryParams) => {
    return getCars(params);
  }, 'fetchCarsFx').pipe(
    withDataAtom(),
    withErrorAtom((_ctx, e) => {
      return (e as Error).message;
    }),
  );
  const lastParamsHolder: { current: CarsQueryParams | null } = {
    current: null,
  };
  return { fetchCarsFx, lastParamsHolder };
}

export function useCarsList(params: CarsQueryParams) {
  const ctx = useCtx();
  const model = useMemo(() => {
    return createCarsListModel();
  }, []);
  const [data] = useAtom(model.fetchCarsFx.dataAtom);
  const [pending] = useAtom(model.fetchCarsFx.pendingAtom);
  const [error] = useAtom(model.fetchCarsFx.errorAtom);

  useEffect(() => {
    model.lastParamsHolder.current = params;
    void model.fetchCarsFx(ctx, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return {
    cars: data?.data ?? [],
    meta: data?.meta,
    isLoading: pending > 0,
    isFetching: pending > 0,
    error: error ?? null,
    refetch: () => {
      if (model.lastParamsHolder.current) {
        void model.fetchCarsFx(ctx, model.lastParamsHolder.current);
      }
    },
  };
}

const _typecheck: CarsListContract = { useCarsList };
void _typecheck;
