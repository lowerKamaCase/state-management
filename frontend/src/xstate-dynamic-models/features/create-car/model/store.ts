import { useMachine } from '@xstate/react';
import { assign, createMachine } from 'xstate';
import { createCar } from '../../../../shared/entities/car/api/carsApi';
import type { CreateCarInput } from '../../../../shared/entities/car/model/types';
import type { CreateCarContract } from '../../../../shared/features/create-car/model/contract';

interface CreateCarContext {
  error: string | null;
}

type CreateCarEvent =
  { type: 'SUBMIT' } | { type: 'SUCCESS' } | { type: 'FAILURE'; error: string };

const createCarMachine = createMachine({
  types: {} as { context: CreateCarContext; events: CreateCarEvent },
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

export function useCreateCar() {
  const [state, send] = useMachine(createCarMachine);

  const runCreateCar = async (input: CreateCarInput) => {
    send({ type: 'SUBMIT' });
    try {
      await createCar(input);
      send({ type: 'SUCCESS' });
    } catch (e) {
      send({ type: 'FAILURE', error: (e as Error).message });
      throw e;
    }
  };

  return {
    createCar: runCreateCar,
    isPending: state.matches('pending'),
    error: state.context.error,
  };
}

const _typecheck: CreateCarContract = { useCreateCar };
void _typecheck;
