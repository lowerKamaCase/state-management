import { useSelector } from '@xstate/react';
import { assign, createActor, createMachine } from 'xstate';
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

const deleteCarActor = createActor(deleteCarMachine).start();

async function runDeleteCar(id: string) {
  deleteCarActor.send({ type: 'SUBMIT' });
  try {
    await deleteCar(id);
    deleteCarActor.send({ type: 'SUCCESS' });
  } catch (e) {
    deleteCarActor.send({ type: 'FAILURE', error: (e as Error).message });
    throw e;
  }
}

export function useDeleteCar() {
  const isPending = useSelector(deleteCarActor, (snapshot) => {
    return snapshot.matches('pending');
  });
  const error = useSelector(deleteCarActor, (snapshot) => {
    return snapshot.context.error;
  });
  return { deleteCar: runDeleteCar, isPending, error };
}

const _typecheck: DeleteCarContract = { useDeleteCar };
void _typecheck;
