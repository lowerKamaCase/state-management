import { useMutation } from '@tanstack/react-query';
import { updateCar } from '../../../../shared/entities/car/api/carsApi';
import type { UpdateCarContract } from '../../../../shared/features/update-car/model/contract';

export function useUpdateCar() {
  const mutation = useMutation({ mutationFn: updateCar });
  return {
    updateCar: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error ? (mutation.error as Error).message : null,
  };
}

const _typecheck: UpdateCarContract = { useUpdateCar };
void _typecheck;
