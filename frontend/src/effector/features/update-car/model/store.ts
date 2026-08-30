import { createEffect } from 'effector';
import { useUnit } from 'effector-react';
import { updateCar } from '../../../../shared/entities/car/api/carsApi';
import type { UpdateCarContract } from '../../../../shared/features/update-car/model/contract';

const updateCarFx = createEffect(updateCar);

export function useUpdateCar() {
  const [run, isPending] = useUnit([updateCarFx, updateCarFx.pending]);
  return { updateCar: run, isPending, error: null };
}

const _typecheck: UpdateCarContract = { useUpdateCar };
void _typecheck;
