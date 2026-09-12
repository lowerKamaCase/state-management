import { useMemo } from 'react';
import { BehaviorSubject } from 'rxjs';
import { updateCar } from '../../../../shared/entities/car/api/carsApi';
import type { UpdateCarInput } from '../../../../shared/entities/car/model/types';
import type { UpdateCarContract } from '../../../../shared/features/update-car/model/contract';
import { useBehaviorSubject } from '../../../../shared/lib/useBehaviorSubject';

interface UpdateCarState {
  isPending: boolean;
  error: string | null;
}

function createUpdateCarModel() {
  const state$ = new BehaviorSubject<UpdateCarState>({
    isPending: false,
    error: null,
  });

  async function runUpdateCar(payload: { id: string; input: UpdateCarInput }) {
    state$.next({ isPending: true, error: null });
    try {
      await updateCar(payload);
    } catch (e) {
      state$.next({ ...state$.getValue(), error: (e as Error).message });
      throw e;
    } finally {
      state$.next({ ...state$.getValue(), isPending: false });
    }
  }

  return { state$, runUpdateCar };
}

export function useUpdateCar() {
  const model = useMemo(() => {
    return createUpdateCarModel();
  }, []);
  const state = useBehaviorSubject(model.state$);
  return { updateCar: model.runUpdateCar, ...state };
}

const _typecheck: UpdateCarContract = { useUpdateCar };
void _typecheck;
