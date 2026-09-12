import { useMachine } from '@xstate/react';
import { assign, createMachine } from 'xstate';
import {
  DEFAULT_FILTERS,
  type CarsFilters,
} from '../../../../shared/entities/car/model/types';
import type { FilterCarsContract } from '../../../../shared/features/filter-cars/model/contract';

type FilterCarsEvent =
  { type: 'SET_FILTERS'; patch: Partial<CarsFilters> } | { type: 'RESET' };

const filterCarsMachine = createMachine({
  types: {} as { context: { filters: CarsFilters }; events: FilterCarsEvent },
  context: { filters: DEFAULT_FILTERS },
  initial: 'active',
  states: {
    active: {
      on: {
        SET_FILTERS: {
          actions: assign({
            filters: ({ context, event }) => {
              return { ...context.filters, ...event.patch };
            },
          }),
        },
        RESET: {
          actions: assign({
            filters: () => {
              return DEFAULT_FILTERS;
            },
          }),
        },
      },
    },
  },
});

/**
 * Unlike the static variant (one actor started at module scope, shared by
 * every mount), useMachine spawns a fresh actor per component instance by
 * default — this is XState's own built-in equivalent of the useMemo/
 * useState factory pattern the other libraries' dynamic variants need to
 * write by hand.
 */
export function useFilterCars() {
  const [state, send] = useMachine(filterCarsMachine);
  return {
    filters: state.context.filters,
    setFilters: (patch: Partial<CarsFilters>) => {
      send({ type: 'SET_FILTERS', patch });
    },
    resetFilters: () => {
      send({ type: 'RESET' });
    },
  };
}

const _typecheck: FilterCarsContract = { useFilterCars };
void _typecheck;
