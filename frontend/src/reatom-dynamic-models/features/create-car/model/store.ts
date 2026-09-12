import { reatomAsync, withErrorAtom } from '@reatom/async';
import { useAtom, useCtx } from '@reatom/npm-react';
import { useMemo } from 'react';
import { createCar } from '../../../../shared/entities/car/api/carsApi';
import type { CreateCarInput } from '../../../../shared/entities/car/model/types';
import type { CreateCarContract } from '../../../../shared/features/create-car/model/contract';

function createCreateCarModel() {
  return reatomAsync((_ctx, input: CreateCarInput) => {
    return createCar(input);
  }, 'createCarFx').pipe(
    withErrorAtom((_ctx, e) => {
      return (e as Error).message;
    }),
  );
}

export function useCreateCar() {
  const ctx = useCtx();
  const createCarFx = useMemo(() => {
    return createCreateCarModel();
  }, []);
  const [pending] = useAtom(createCarFx.pendingAtom);
  const [error] = useAtom(createCarFx.errorAtom);
  return {
    createCar: (input: CreateCarInput) => {
      return createCarFx(ctx, input);
    },
    isPending: pending > 0,
    error: error ?? null,
  };
}

const _typecheck: CreateCarContract = { useCreateCar };
void _typecheck;
