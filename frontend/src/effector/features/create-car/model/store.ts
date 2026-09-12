import { createEffect, createStore } from 'effector';
import { useUnit } from 'effector-react';
import { createCar } from '../../../../shared/entities/car/api/carsApi';
import type { CreateCarContract } from '../../../../shared/features/create-car/model/contract';

const createCarFx = createEffect(createCar);

const $error = createStore<string | null>(null)
  .on(createCarFx.failData, (_, e) => {
    return e.message;
  })
  .on(createCarFx.done, () => {
    return null;
  });

export function useCreateCar() {
  const [run, isPending, error] = useUnit([
    createCarFx,
    createCarFx.pending,
    $error,
  ]);
  return { createCar: run, isPending, error };
}

const _typecheck: CreateCarContract = { useCreateCar };
void _typecheck;
