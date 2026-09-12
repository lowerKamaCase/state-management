import { createEffect, createStore } from 'effector';
import { useUnit } from 'effector-react';
import { useMemo } from 'react';
import { updateCar } from '../../../../shared/entities/car/api/carsApi';
import type { UpdateCarContract } from '../../../../shared/features/update-car/model/contract';

function createUpdateCarModel() {
  const updateCarFx = createEffect(updateCar);

  const $error = createStore<string | null>(null)
    .on(updateCarFx.failData, (_, e) => {
      return e.message;
    })
    .on(updateCarFx.done, () => {
      return null;
    });

  return { updateCarFx, $error };
}

export function useUpdateCar() {
  const model = useMemo(() => {
    return createUpdateCarModel();
  }, []);
  const [run, isPending, error] = useUnit([
    model.updateCarFx,
    model.updateCarFx.pending,
    model.$error,
  ]);
  return { updateCar: run, isPending, error };
}

const _typecheck: UpdateCarContract = { useUpdateCar };
void _typecheck;
