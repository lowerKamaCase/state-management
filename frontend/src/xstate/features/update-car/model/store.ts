import { useSelector } from '@xstate/react';
import { assign, createActor, createMachine } from 'xstate';
import { updateCar } from '../../../../shared/entities/car/api/carsApi';
import type { UpdateCarInput } from '../../../../shared/entities/car/model/types';
import type { UpdateCarContract } from '../../../../shared/features/update-car/model/contract';

interface UpdateCarContext {
  error: string | null;
}

type UpdateCarEvent =
  { type: 'SUBMIT' } | { type: 'SUCCESS' } | { type: 'FAILURE'; error: string };

const updateCarMachine = createMachine({
  types: {} as { context: UpdateCarContext; events: UpdateCarEvent },
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

const updateCarActor = createActor(updateCarMachine).start();

async function runUpdateCar(payload: { id: string; input: UpdateCarInput }) {
  updateCarActor.send({ type: 'SUBMIT' });
  try {
    await updateCar(payload);
    updateCarActor.send({ type: 'SUCCESS' });
  } catch (e) {
    updateCarActor.send({ type: 'FAILURE', error: (e as Error).message });
    throw e;
  }
}

export function useUpdateCar() {
  const isPending = useSelector(updateCarActor, (snapshot) => {
    return snapshot.matches('pending');
  });
  const error = useSelector(updateCarActor, (snapshot) => {
    return snapshot.context.error;
  });
  return { updateCar: runUpdateCar, isPending, error };
}

const _typecheck: UpdateCarContract = { useUpdateCar };
void _typecheck;
