import { useMutation } from '@tanstack/react-query';
import { addPreparationTask } from '../../../entities/preparation-task';

export function useAddPreparationTask({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const mutation = useMutation({
    mutationFn: ({ carId, title }: { carId: string; title: string }) => {
      return addPreparationTask(carId, title);
    },
    onSuccess,
  });

  return {
    addTask: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}
