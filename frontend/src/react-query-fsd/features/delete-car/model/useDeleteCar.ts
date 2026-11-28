import { useMutation } from '@tanstack/react-query';
import { deleteCar } from '../api/deleteCar';

export function useDeleteCar({ onSuccess }: { onSuccess: () => void }) {
  const mutation = useMutation({ mutationFn: deleteCar, onSuccess });

  return {
    deleteCar: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}
