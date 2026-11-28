import { useMutation } from '@tanstack/react-query';
import { createCar } from '../api/createCar';

export function useCreateCar({ onSuccess }: { onSuccess: () => void }) {
  const mutation = useMutation({ mutationFn: createCar, onSuccess });

  return { createCar: mutation.mutateAsync, isPending: mutation.isPending };
}
