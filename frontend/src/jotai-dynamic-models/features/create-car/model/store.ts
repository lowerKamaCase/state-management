import { atom, createStore, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { createCar } from '../../../../shared/entities/car/api/carsApi';
import type { CreateCarInput } from '../../../../shared/entities/car/model/types';
import type { CreateCarContract } from '../../../../shared/features/create-car/model/contract';

function createCreateCarModel() {
  const store = createStore();
  const isPendingAtom = atom(false);
  const errorAtom = atom<string | null>(null);

  const createCarAtom = atom(null, async (_get, set, input: CreateCarInput) => {
    set(isPendingAtom, true);
    set(errorAtom, null);
    try {
      await createCar(input);
    } catch (e) {
      set(errorAtom, (e as Error).message);
      throw e;
    } finally {
      set(isPendingAtom, false);
    }
  });

  return { store, isPendingAtom, errorAtom, createCarAtom };
}

export function useCreateCar() {
  const [model] = useState(() => {
    return createCreateCarModel();
  });
  const { store } = model;
  const createCarAction = useSetAtom(model.createCarAtom, { store });
  const isPending = useAtomValue(model.isPendingAtom, { store });
  const error = useAtomValue(model.errorAtom, { store });
  return { createCar: createCarAction, isPending, error };
}

const _typecheck: CreateCarContract = { useCreateCar };
void _typecheck;
