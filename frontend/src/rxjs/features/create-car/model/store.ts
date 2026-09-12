import { BehaviorSubject } from 'rxjs';
import { createCar } from '../../../../shared/entities/car/api/carsApi';
import type { CreateCarInput } from '../../../../shared/entities/car/model/types';
import type { CreateCarContract } from '../../../../shared/features/create-car/model/contract';
import { useBehaviorSubject } from '../../../../shared/lib/useBehaviorSubject';

interface CreateCarState {
  isPending: boolean;
  error: string | null;
}

const state$ = new BehaviorSubject<CreateCarState>({
  isPending: false,
  error: null,
});

async function runCreateCar(input: CreateCarInput) {
  state$.next({ isPending: true, error: null });
  try {
    await createCar(input);
  } catch (e) {
    state$.next({ ...state$.getValue(), error: (e as Error).message });
    throw e;
  } finally {
    state$.next({ ...state$.getValue(), isPending: false });
  }
}

export function useCreateCar() {
  const state = useBehaviorSubject(state$);
  return { createCar: runCreateCar, ...state };
}

const _typecheck: CreateCarContract = { useCreateCar };
void _typecheck;
