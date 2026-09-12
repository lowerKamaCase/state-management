import { reatomAsync, withErrorAtom } from '@reatom/async';
import { useAtom, useCtx } from '@reatom/npm-react';
import { updateCar } from '../../../../shared/entities/car/api/carsApi';
import type { UpdateCarInput } from '../../../../shared/entities/car/model/types';
import type { UpdateCarContract } from '../../../../shared/features/update-car/model/contract';

const updateCarFx = reatomAsync(
  (_ctx, payload: { id: string; input: UpdateCarInput }) => {
    return updateCar(payload);
  },
  'updateCarFx',
).pipe(
  withErrorAtom((_ctx, e) => {
    return (e as Error).message;
  }),
);

export function useUpdateCar() {
  const ctx = useCtx();
  const [pending] = useAtom(updateCarFx.pendingAtom);
  const [error] = useAtom(updateCarFx.errorAtom);
  return {
    updateCar: (payload: { id: string; input: UpdateCarInput }) => {
      return updateCarFx(ctx, payload);
    },
    isPending: pending > 0,
    error: error ?? null,
  };
}

const _typecheck: UpdateCarContract = { useUpdateCar };
void _typecheck;
