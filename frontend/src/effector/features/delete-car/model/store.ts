import { createEffect, createStore } from 'effector';
import { useUnit } from 'effector-react';
import { deleteCar } from '../../../../shared/entities/car/api/carsApi';
import type { DeleteCarContract } from '../../../../shared/features/delete-car/model/contract';

const deleteCarFx = createEffect(deleteCar);

const $error = createStore<string | null>(null)
  .on(deleteCarFx.failData, (_, e) => {
    return e.message;
  })
  .on(deleteCarFx.done, () => {
    return null;
  });

export function useDeleteCar() {
  const [run, isPending, error] = useUnit([
    deleteCarFx,
    deleteCarFx.pending,
    $error,
  ]);
  return { deleteCar: run, isPending, error };
}

const _typecheck: DeleteCarContract = { useDeleteCar };
void _typecheck;
