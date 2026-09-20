import { atom, useAtomValue, useSetAtom } from 'jotai';
import { deleteCar } from '../../../../shared/entities/car/api/carsApi';
import type { DeleteCarContract } from '../../../../shared/features/delete-car/model/contract';

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

export function useDeleteCar() {
  const deleteCarAction = useSetAtom(deleteCarAtom);
  const isPending = useAtomValue(isPendingAtom);
  const error = useAtomValue(errorAtom);
  return { deleteCar: deleteCarAction, isPending, error };
}

const _typecheck: DeleteCarContract = { useDeleteCar };
void _typecheck;
