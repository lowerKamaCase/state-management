import { useMutation } from '@tanstack/react-query';
import {
  setPreparationTaskStatus,
  type PreparationTaskStatus,
} from '../../../entities/preparation-task';

export function useSetPreparationTaskStatus({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const mutation = useMutation({
    mutationFn: ({
      carId,
      taskId,
      status,
    }: {
      carId: string;
      taskId: string;
      status: PreparationTaskStatus;
    }) => {
      return setPreparationTaskStatus(carId, taskId, status);
    },
    onSuccess,
  });

  return {
    setStatus: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}
