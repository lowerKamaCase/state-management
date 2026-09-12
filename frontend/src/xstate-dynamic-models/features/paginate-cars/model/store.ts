import { useMachine } from '@xstate/react';
import { assign, createMachine } from 'xstate';
import { DEFAULT_PAGE } from '../../../../shared/entities/car/model/types';
import type { PaginateCarsContract } from '../../../../shared/features/paginate-cars/model/contract';

interface PageState {
  page: number;
  pageSize: number;
}

type PaginateCarsEvent =
  | { type: 'SET_PAGE'; page: number }
  | { type: 'SET_PAGE_SIZE'; pageSize: number };

const paginateCarsMachine = createMachine({
  types: {} as { context: PageState; events: PaginateCarsEvent },
  context: DEFAULT_PAGE,
  initial: 'active',
  states: {
    active: {
      on: {
        SET_PAGE: {
          actions: assign({
            page: ({ event }) => {
              return event.page;
            },
          }),
        },
        SET_PAGE_SIZE: {
          actions: assign({
            pageSize: ({ event }) => {
              return event.pageSize;
            },
          }),
        },
      },
    },
  },
});

export function usePaginateCars() {
  const [state, send] = useMachine(paginateCarsMachine);
  return {
    page: state.context.page,
    pageSize: state.context.pageSize,
    setPage: (nextPage: number) => {
      send({ type: 'SET_PAGE', page: nextPage });
    },
    setPageSize: (pageSize: number) => {
      send({ type: 'SET_PAGE_SIZE', pageSize });
    },
  };
}

const _typecheck: PaginateCarsContract = { usePaginateCars };
void _typecheck;
