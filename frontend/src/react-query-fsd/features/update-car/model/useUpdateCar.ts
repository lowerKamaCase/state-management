import { useMutation } from '@tanstack/react-query';
import type { UpdateCarInput } from '../../../entities/car';
import { updateCar } from '../api/updateCar';

export function useUpdateCar({ onSuccess }: { onSuccess: () => void }) {
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCarInput }) => {
      return updateCar(id, input);
    },
    onSuccess,
  });

  return { updateCar: mutation.mutateAsync, isPending: mutation.isPending };
}
