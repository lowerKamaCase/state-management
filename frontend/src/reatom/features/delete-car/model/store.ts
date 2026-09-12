import { reatomAsync, withErrorAtom } from '@reatom/async';
import { useAtom, useCtx } from '@reatom/npm-react';
import { deleteCar } from '../../../../shared/entities/car/api/carsApi';
import type { DeleteCarContract } from '../../../../shared/features/delete-car/model/contract';

const deleteCarFx = reatomAsync((_ctx, id: string) => {
  return deleteCar(id);
}, 'deleteCarFx').pipe(
  withErrorAtom((_ctx, e) => {
    return (e as Error).message;
  }),
);

export function useDeleteCar() {
  const ctx = useCtx();
  const [pending] = useAtom(deleteCarFx.pendingAtom);
  const [error] = useAtom(deleteCarFx.errorAtom);
  return {
    deleteCar: (id: string) => {
      return deleteCarFx(ctx, id);
    },
    isPending: pending > 0,
    error: error ?? null,
  };
}

const _typecheck: DeleteCarContract = { useDeleteCar };
void _typecheck;
