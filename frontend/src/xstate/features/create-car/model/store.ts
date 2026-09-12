import { useSelector } from '@xstate/react';
import { assign, createActor, createMachine } from 'xstate';
import { createCar } from '../../../../shared/entities/car/api/carsApi';
import type { CreateCarInput } from '../../../../shared/entities/car/model/types';
import type { CreateCarContract } from '../../../../shared/features/create-car/model/contract';

interface CreateCarContext {
  error: string | null;
}

type CreateCarEvent =
  { type: 'SUBMIT' } | { type: 'SUCCESS' } | { type: 'FAILURE'; error: string };

/**
 * The machine only tracks isPending/error via plain SUBMIT/SUCCESS/FAILURE
 * events — the actual API call happens in the plain `runCreateCar` wrapper
 * below, outside the machine, so its promise genuinely rejects on failure
 * (CarFormModal's own try/catch relies on that). Routing the real request
 * through an invoked actor and bridging its onDone/onError back to a
 * caller-awaited promise would work too, but adds real complexity for no
 * benefit here — nothing else needs to observe the request as an actor.
 */
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

const createCarActor = createActor(createCarMachine).start();

async function runCreateCar(input: CreateCarInput) {
  createCarActor.send({ type: 'SUBMIT' });
  try {
    await createCar(input);
    createCarActor.send({ type: 'SUCCESS' });
  } catch (e) {
    createCarActor.send({ type: 'FAILURE', error: (e as Error).message });
    throw e;
  }
}

export function useCreateCar() {
  const isPending = useSelector(createCarActor, (snapshot) => {
    return snapshot.matches('pending');
  });
  const error = useSelector(createCarActor, (snapshot) => {
    return snapshot.context.error;
  });
  return { createCar: runCreateCar, isPending, error };
}

const _typecheck: CreateCarContract = { useCreateCar };
void _typecheck;
