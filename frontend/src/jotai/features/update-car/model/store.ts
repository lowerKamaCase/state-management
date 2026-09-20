import { atom, useAtomValue, useSetAtom } from 'jotai';
import { updateCar } from '../../../../shared/entities/car/api/carsApi';
import type { UpdateCarInput } from '../../../../shared/entities/car/model/types';
import type { UpdateCarContract } from '../../../../shared/features/update-car/model/contract';

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

export function useUpdateCar() {
  const updateCarAction = useSetAtom(updateCarAtom);
  const isPending = useAtomValue(isPendingAtom);
  const error = useAtomValue(errorAtom);
  return { updateCar: updateCarAction, isPending, error };
}

const _typecheck: UpdateCarContract = { useUpdateCar };
void _typecheck;
