import { useSelector } from '@xstate/react';
import { assign, createActor, createMachine } from 'xstate';
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

const filterCarsActor = createActor(filterCarsMachine).start();

export function useFilterCars() {
  const filters = useSelector(filterCarsActor, (snapshot) => {
    return snapshot.context.filters;
  });
  return {
    filters,
    setFilters: (patch: Partial<CarsFilters>) => {
      filterCarsActor.send({ type: 'SET_FILTERS', patch });
    },
    resetFilters: () => {
      filterCarsActor.send({ type: 'RESET' });
    },
  };
}

const _typecheck: FilterCarsContract = { useFilterCars };
void _typecheck;
