import { useMachine } from '@xstate/react';
import { assign, createMachine } from 'xstate';
import { deleteCar } from '../../../../shared/entities/car/api/carsApi';
import type { DeleteCarContract } from '../../../../shared/features/delete-car/model/contract';

interface DeleteCarContext {
  error: string | null;
}

type DeleteCarEvent =
  { type: 'SUBMIT' } | { type: 'SUCCESS' } | { type: 'FAILURE'; error: string };

const deleteCarMachine = createMachine({
  types: {} as { context: DeleteCarContext; events: DeleteCarEvent },
  context: { error: null },
  initial: 'idle',
  states: {
    idle: {
      on: { SUBMIT: 'pending' },
    },
    pending: {
      on: {
        SUCCESS: {
          target: 'idle',
          actions: assign({
            error: () => {
              return null;
            },
          }),
        },
        FAILURE: {
          target: 'idle',
          actions: assign({
            error: ({ event }) => {
              return event.error;
            },
          }),
        },
      },
    },
  },
});

export function useDeleteCar() {
  const [state, send] = useMachine(deleteCarMachine);

  const runDeleteCar = async (id: string) => {
    send({ type: 'SUBMIT' });
    try {
      await deleteCar(id);
      send({ type: 'SUCCESS' });
    } catch (e) {
      send({ type: 'FAILURE', error: (e as Error).message });
      throw e;
    }
  };

  return {
    deleteCar: runDeleteCar,
    isPending: state.matches('pending'),
    error: state.context.error,
  };
}

const _typecheck: DeleteCarContract = { useDeleteCar };
void _typecheck;
