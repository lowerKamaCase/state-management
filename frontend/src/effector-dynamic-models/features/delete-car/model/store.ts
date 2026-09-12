import { createEffect, createStore } from 'effector';
import { useUnit } from 'effector-react';
import { useMemo } from 'react';
import { deleteCar } from '../../../../shared/entities/car/api/carsApi';
import type { DeleteCarContract } from '../../../../shared/features/delete-car/model/contract';

function createDeleteCarModel() {
  const deleteCarFx = createEffect(deleteCar);

  const $error = createStore<string | null>(null)
    .on(deleteCarFx.failData, (_, e) => {
      return e.message;
    })
    .on(deleteCarFx.done, () => {
      return null;
    });

  return { deleteCarFx, $error };
}

export function useDeleteCar() {
  const model = useMemo(() => {
    return createDeleteCarModel();
  }, []);
  const [run, isPending, error] = useUnit([
    model.deleteCarFx,
    model.deleteCarFx.pending,
    model.$error,
  ]);
  return { deleteCar: run, isPending, error };
}

const _typecheck: DeleteCarContract = { useDeleteCar };
void _typecheck;
