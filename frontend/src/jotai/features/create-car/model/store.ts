import { atom, useAtomValue, useSetAtom } from 'jotai';
import { createCar } from '../../../../shared/entities/car/api/carsApi';
import type { CreateCarInput } from '../../../../shared/entities/car/model/types';
import type { CreateCarContract } from '../../../../shared/features/create-car/model/contract';

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

export function useCreateCar() {
  const createCarAction = useSetAtom(createCarAtom);
  const isPending = useAtomValue(isPendingAtom);
  const error = useAtomValue(errorAtom);
  return { createCar: createCarAction, isPending, error };
}

const _typecheck: CreateCarContract = { useCreateCar };
void _typecheck;
