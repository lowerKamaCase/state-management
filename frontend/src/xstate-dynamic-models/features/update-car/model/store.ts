import { useMachine } from '@xstate/react';
import { assign, createMachine } from 'xstate';
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

export function useUpdateCar() {
  const [state, send] = useMachine(updateCarMachine);

  const runUpdateCar = async (payload: {
    id: string;
    input: UpdateCarInput;
  }) => {
    send({ type: 'SUBMIT' });
    try {
      await updateCar(payload);
      send({ type: 'SUCCESS' });
    } catch (e) {
      send({ type: 'FAILURE', error: (e as Error).message });
      throw e;
    }
  };

  return {
    updateCar: runUpdateCar,
    isPending: state.matches('pending'),
    error: state.context.error,
  };
}

const _typecheck: UpdateCarContract = { useUpdateCar };
void _typecheck;
