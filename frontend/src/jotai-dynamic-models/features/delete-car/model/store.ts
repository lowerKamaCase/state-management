import { atom, createStore, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { deleteCar } from '../../../../shared/entities/car/api/carsApi';
import type { DeleteCarContract } from '../../../../shared/features/delete-car/model/contract';

function createDeleteCarModel() {
  const store = createStore();
  const isPendingAtom = atom(false);
  const errorAtom = atom<string | null>(null);

  const deleteCarAtom = atom(null, async (_get, set, id: string) => {
    set(isPendingAtom, true);
    set(errorAtom, null);
    try {
      await deleteCar(id);
    } catch (e) {
      set(errorAtom, (e as Error).message);
      throw e;
    } finally {
      set(isPendingAtom, false);
    }
  });

  return { store, isPendingAtom, errorAtom, deleteCarAtom };
}

export function useDeleteCar() {
  const [model] = useState(() => {
    return createDeleteCarModel();
  });
  const { store } = model;
  const deleteCarAction = useSetAtom(model.deleteCarAtom, { store });
  const isPending = useAtomValue(model.isPendingAtom, { store });
  const error = useAtomValue(model.errorAtom, { store });
  return { deleteCar: deleteCarAction, isPending, error };
}

const _typecheck: DeleteCarContract = { useDeleteCar };
void _typecheck;
