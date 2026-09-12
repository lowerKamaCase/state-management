import { useEffect } from 'react';
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
 * Nothing but useCarsList leaves this file — module-level singleton
 * subjects, shared by every mount. switchMap cancels the in-flight request
 * whenever params change again before it resolves, which effector/zustand/
 * mobx don't do on their own (see CarsFilters' debounce comment) — this is
 * the one place RxJS's operators earn their keep over a plain state field.
 */
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

export function useCarsList(params: CarsQueryParams) {
  const state = useBehaviorSubject(state$);
  useEffect(() => {
    paramsChanged$.next(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);
  return {
    cars: state.cars,
    meta: state.meta,
    isLoading: state.isLoading,
    isFetching: state.isLoading,
    error: state.error,
    refetch: () => {
      refreshRequested$.next();
    },
  };
}

const _typecheck: CarsListContract = { useCarsList };
void _typecheck;
