import { createEffect, createStore } from 'effector';
import { useUnit } from 'effector-react';
import { useMemo } from 'react';
import { createCar } from '../../../../shared/entities/car/api/carsApi';
import type { CreateCarContract } from '../../../../shared/features/create-car/model/contract';

function createCreateCarModel() {
  const createCarFx = createEffect(createCar);

  const $error = createStore<string | null>(null)
    .on(createCarFx.failData, (_, e) => {
      return e.message;
    })
    .on(createCarFx.done, () => {
      return null;
    });

  return { createCarFx, $error };
}

export function useCreateCar() {
  const model = useMemo(() => {
    return createCreateCarModel();
  }, []);
  const [run, isPending, error] = useUnit([
    model.createCarFx,
    model.createCarFx.pending,
    model.$error,
  ]);
  return { createCar: run, isPending, error };
}

const _typecheck: CreateCarContract = { useCreateCar };
void _typecheck;
