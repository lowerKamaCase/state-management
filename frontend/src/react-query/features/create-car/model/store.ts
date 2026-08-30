import { useMutation } from '@tanstack/react-query';
import { createCar } from '../../../../shared/entities/car/api/carsApi';
import type { CreateCarContract } from '../../../../shared/features/create-car/model/contract';

export function useCreateCar() {
  const mutation = useMutation({ mutationFn: createCar });
  return {
    createCar: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error ? (mutation.error as Error).message : null,
  };
}

const _typecheck: CreateCarContract = { useCreateCar };
void _typecheck;
