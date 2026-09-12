import { useMachine } from '@xstate/react';
import { assign, createMachine } from 'xstate';
import {
  DEFAULT_SORT,
  type CarSortField,
  type SortOrder,
} from '../../../../shared/entities/car/model/types';
import type { SortCarsContract } from '../../../../shared/features/sort-cars/model/contract';

interface SortState {
  sortBy: CarSortField;
  order: SortOrder;
}

type SortCarsEvent = {
  type: 'SET_SORT';
  sortBy: CarSortField;
  order: SortOrder;
};

const sortCarsMachine = createMachine({
  types: {} as { context: SortState; events: SortCarsEvent },
  context: DEFAULT_SORT,
  initial: 'active',
  states: {
    active: {
      on: {
        SET_SORT: {
          actions: assign({
            sortBy: ({ event }) => {
              return event.sortBy;
            },
            order: ({ event }) => {
              return event.order;
            },
          }),
        },
      },
    },
  },
});

export function useSortCars() {
  const [state, send] = useMachine(sortCarsMachine);
  return {
    sortBy: state.context.sortBy,
    order: state.context.order,
    setSort: (sortBy: CarSortField, order: SortOrder) => {
      send({ type: 'SET_SORT', sortBy, order });
    },
  };
}

const _typecheck: SortCarsContract = { useSortCars };
void _typecheck;
