import { useEffect, useMemo } from 'react';
import { BehaviorSubject, from, merge, of, Subject } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { getCars } from '../../../../shared/entities/car/api/carsApi';
import type { CarsListContract } from '../../../../shared/entities/car/model/contract';
import type {
  Car,
  CarsQueryParams,
  PaginatedMeta,
} from '../../../../shared/entities/car/model/types';
import { useBehaviorSubject } from '../../../../shared/lib/useBehaviorSubject';

interface CarsListState {
  cars: Car[];
  meta: PaginatedMeta | undefined;
  isLoading: boolean;
  error: string | null;
}

const INITIAL_STATE: CarsListState = {
  cars: [],
  meta: undefined,
  isLoading: false,
  error: null,
};

/**
 * Unlike the static variant (module-level singleton subjects, shared by
 * every mount), this factory is called fresh per component instance via
 * useMemo — each mount gets its own subjects and its own switchMap
 * subscription, so two CarsList consumers on the same page never share
 * state or cancel each other's in-flight requests.
 */
function createCarsListModel() {
  const paramsChanged$ = new Subject<CarsQueryParams>();
  const refreshRequested$ = new Subject<void>();
  const state$ = new BehaviorSubject<CarsListState>(INITIAL_STATE);

  let lastParams: CarsQueryParams | null = null;

  merge(
    paramsChanged$.pipe(
      tap((params) => {
        lastParams = params;
      }),
    ),
    refreshRequested$.pipe(
      filter(() => {
        return lastParams !== null;
      }),
      map(() => {
        return lastParams as CarsQueryParams;
      }),
    ),
  )
    .pipe(
      tap(() => {
        state$.next({ ...state$.getValue(), isLoading: true, error: null });
      }),
      switchMap((params) => {
        return from(getCars(params)).pipe(
          map((res): CarsListState => {
            return {
              cars: res.data,
              meta: res.meta,
              isLoading: false,
              error: null,
            };
          }),
          catchError((e) => {
            return of<CarsListState>({
              ...state$.getValue(),
              isLoading: false,
              error: (e as Error).message,
            });
          }),
        );
      }),
    )
    .subscribe((next) => {
      state$.next(next);
    });

  return { paramsChanged$, refreshRequested$, state$ };
}

export function useCarsList(params: CarsQueryParams) {
  const model = useMemo(() => {
    return createCarsListModel();
  }, []);
  const state = useBehaviorSubject(model.state$);
  useEffect(() => {
    model.paramsChanged$.next(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);
  return {
    cars: state.cars,
    meta: state.meta,
    isLoading: state.isLoading,
    isFetching: state.isLoading,
    error: state.error,
    refetch: () => {
      model.refreshRequested$.next();
    },
  };
}

const _typecheck: CarsListContract = { useCarsList };
void _typecheck;
