import { atom, createStore, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { updateCar } from '../../../../shared/entities/car/api/carsApi';
import type { UpdateCarInput } from '../../../../shared/entities/car/model/types';
import type { UpdateCarContract } from '../../../../shared/features/update-car/model/contract';

function createUpdateCarModel() {
  const store = createStore();
  const isPendingAtom = atom(false);
  const errorAtom = atom<string | null>(null);

  const updateCarAtom = atom(
    null,
    async (_get, set, payload: { id: string; input: UpdateCarInput }) => {
      set(isPendingAtom, true);
      set(errorAtom, null);
      try {
        await updateCar(payload);
      } catch (e) {
        set(errorAtom, (e as Error).message);
        throw e;
      } finally {
        set(isPendingAtom, false);
      }
    },
  );

  return { store, isPendingAtom, errorAtom, updateCarAtom };
}

export function useUpdateCar() {
  const [model] = useState(() => {
    return createUpdateCarModel();
  });
  const { store } = model;
  const updateCarAction = useSetAtom(model.updateCarAtom, { store });
  const isPending = useAtomValue(model.isPendingAtom, { store });
  const error = useAtomValue(model.errorAtom, { store });
  return { updateCar: updateCarAction, isPending, error };
}

const _typecheck: UpdateCarContract = { useUpdateCar };
void _typecheck;
