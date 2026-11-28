import { useQuery } from '@tanstack/react-query';
import { getPreparationTasks } from '../api/tasks';

export function usePreparationTasks(carId: string) {
  const query = useQuery({
    queryKey: ['fsd', 'preparation-tasks', carId],
    queryFn: () => {
      return getPreparationTasks(carId);
    },
  });

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}
