import { createEffect } from 'effector';
import { useUnit } from 'effector-react';
import { deleteCar } from '../../../../shared/entities/car/api/carsApi';
import type { DeleteCarContract } from '../../../../shared/features/delete-car/model/contract';

const deleteCarFx = createEffect(deleteCar);

export function useDeleteCar() {
  const [run, isPending] = useUnit([deleteCarFx, deleteCarFx.pending]);
  return { deleteCar: run, isPending, error: null };
}

const _typecheck: DeleteCarContract = { useDeleteCar };
void _typecheck;
