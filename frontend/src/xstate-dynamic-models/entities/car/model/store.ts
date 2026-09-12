import { useMachine } from '@xstate/react';
import { useEffect } from 'react';
import { assign, createMachine, fromPromise } from 'xstate';
import { getCars } from '../../../../shared/entities/car/api/carsApi';
import type { CarsListContract } from '../../../../shared/entities/car/model/contract';
import type {
  Car,
  CarsQueryParams,
  PaginatedMeta,
} from '../../../../shared/entities/car/model/types';

interface CarsListContext {
  cars: Car[];
  meta: PaginatedMeta | undefined;
  error: string | null;
  params: CarsQueryParams | null;
}

type CarsListEvent =
  { type: 'FETCH'; params: CarsQueryParams } | { type: 'REFRESH' };

const carsListMachine = createMachine({
  types: {} as { context: CarsListContext; events: CarsListEvent },
  context: { cars: [], meta: undefined, error: null, params: null },
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: {
          target: 'loading',
          actions: assign({
            params: ({ event }) => {
              return event.params;
            },
          }),
        },
      },
    },
    loading: {
      invoke: {
        src: fromPromise(
          ({ input }: { input: { params: CarsQueryParams } }) => {
            return getCars(input.params);
          },
        ),
        input: ({ context }) => {
          return { params: context.params as CarsQueryParams };
        },
        onDone: {
          target: 'idle',
          actions: assign({
            cars: ({ event }) => {
              return event.output.data;
            },
            meta: ({ event }) => {
              return event.output.meta;
            },
            error: () => {
              return null;
            },
          }),
        },
        onError: {
          target: 'idle',
          actions: assign({
            error: ({ event }) => {
              return (event.error as Error).message;
            },
          }),
        },
      },
      on: {
        FETCH: {
          target: 'loading',
          reenter: true,
          actions: assign({
            params: ({ event }) => {
              return event.params;
            },
          }),
        },
      },
    },
  },
  on: {
    REFRESH: {
      target: '.loading',
      reenter: true,
      guard: ({ context }) => {
        return context.params !== null;
      },
    },
  },
});

/**
 * Unlike the static variant (one actor started at module scope, shared by
 * every mount), useMachine spawns a fresh actor per component instance by
 * default — each mount gets its own list state.
 */
export function useCarsList(params: CarsQueryParams) {
  const [state, send] = useMachine(carsListMachine);

  useEffect(() => {
    send({ type: 'FETCH', params });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return {
    cars: state.context.cars,
    meta: state.context.meta,
    isLoading: state.matches('loading'),
    isFetching: state.matches('loading'),
    error: state.context.error,
    refetch: () => {
      send({ type: 'REFRESH' });
    },
  };
}

const _typecheck: CarsListContract = { useCarsList };
void _typecheck;
