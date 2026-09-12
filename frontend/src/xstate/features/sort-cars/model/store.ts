import { useSelector } from '@xstate/react';
import { assign, createActor, createMachine } from 'xstate';
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

const sortCarsActor = createActor(sortCarsMachine).start();

export function useSortCars() {
  const sort = useSelector(sortCarsActor, (snapshot) => {
    return snapshot.context;
  });
  return {
    sortBy: sort.sortBy,
    order: sort.order,
    setSort: (sortBy: CarSortField, order: SortOrder) => {
      sortCarsActor.send({ type: 'SET_SORT', sortBy, order });
    },
  };
}

const _typecheck: SortCarsContract = { useSortCars };
void _typecheck;
