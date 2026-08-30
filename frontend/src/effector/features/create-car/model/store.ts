import { createEffect } from 'effector';
import { useUnit } from 'effector-react';
import { createCar } from '../../../../shared/entities/car/api/carsApi';
import type { CreateCarContract } from '../../../../shared/features/create-car/model/contract';

const createCarFx = createEffect(createCar);

export function useCreateCar() {
  const [run, isPending] = useUnit([createCarFx, createCarFx.pending]);
  return { createCar: run, isPending, error: null };
}

const _typecheck: CreateCarContract = { useCreateCar };
void _typecheck;
