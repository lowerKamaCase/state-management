import { useMutation } from '@tanstack/react-query';
import { deleteCar } from '../../../../shared/entities/car/api/carsApi';
import type { DeleteCarContract } from '../../../../shared/features/delete-car/model/contract';

export function useDeleteCar() {
  const mutation = useMutation({ mutationFn: deleteCar });
  return {
    deleteCar: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error ? (mutation.error as Error).message : null,
  };
}

const _typecheck: DeleteCarContract = { useDeleteCar };
void _typecheck;
