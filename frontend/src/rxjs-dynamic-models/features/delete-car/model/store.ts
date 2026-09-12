import { useMemo } from 'react';
import { BehaviorSubject } from 'rxjs';
import { deleteCar } from '../../../../shared/entities/car/api/carsApi';
import type { DeleteCarContract } from '../../../../shared/features/delete-car/model/contract';
import { useBehaviorSubject } from '../../../../shared/lib/useBehaviorSubject';

interface DeleteCarState {
  isPending: boolean;
  error: string | null;
}

function createDeleteCarModel() {
  const state$ = new BehaviorSubject<DeleteCarState>({
    isPending: false,
    error: null,
  });

  async function runDeleteCar(id: string) {
    state$.next({ isPending: true, error: null });
    try {
      await deleteCar(id);
    } catch (e) {
      state$.next({ ...state$.getValue(), error: (e as Error).message });
      throw e;
    } finally {
      state$.next({ ...state$.getValue(), isPending: false });
    }
  }

  return { state$, runDeleteCar };
}

export function useDeleteCar() {
  const model = useMemo(() => {
    return createDeleteCarModel();
  }, []);
  const state = useBehaviorSubject(model.state$);
  return { deleteCar: model.runDeleteCar, ...state };
}

const _typecheck: DeleteCarContract = { useDeleteCar };
void _typecheck;
