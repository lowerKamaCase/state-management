import { createEffect, createStore } from 'effector';
import { useUnit } from 'effector-react';
import { updateCar } from '../../../../shared/entities/car/api/carsApi';
import type { UpdateCarContract } from '../../../../shared/features/update-car/model/contract';

const updateCarFx = createEffect(updateCar);

const $error = createStore<string | null>(null)
  .on(updateCarFx.failData, (_, e) => {
    return e.message;
  })
  .on(updateCarFx.done, () => {
    return null;
  });

export function useUpdateCar() {
  const [run, isPending, error] = useUnit([
    updateCarFx,
    updateCarFx.pending,
    $error,
  ]);
  return { updateCar: run, isPending, error };
}

const _typecheck: UpdateCarContract = { useUpdateCar };
void _typecheck;
