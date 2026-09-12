import { useSelector } from '@xstate/react';
import { useEffect } from 'react';
import { assign, createActor, createMachine, fromPromise } from 'xstate';
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

/**
 * Nothing but useCarsList leaves this file — module-level singleton actor,
 * shared by every mount. A mutation feature that needs a fresh list calls
 * the `refetch()` this hook returns.
 */
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

const carsListActor = createActor(carsListMachine).start();

export function useCarsList(params: CarsQueryParams) {
  const cars = useSelector(carsListActor, (snapshot) => {
    return snapshot.context.cars;
  });
  const meta = useSelector(carsListActor, (snapshot) => {
    return snapshot.context.meta;
  });
  const error = useSelector(carsListActor, (snapshot) => {
    return snapshot.context.error;
  });
  const isLoading = useSelector(carsListActor, (snapshot) => {
    return snapshot.matches('loading');
  });

  useEffect(() => {
    carsListActor.send({ type: 'FETCH', params });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  return {
    cars,
    meta,
    isLoading,
    isFetching: isLoading,
    error,
    refetch: () => {
      carsListActor.send({ type: 'REFRESH' });
    },
  };
}

const _typecheck: CarsListContract = { useCarsList };
void _typecheck;
