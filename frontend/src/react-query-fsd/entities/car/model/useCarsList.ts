import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getCars } from '../api/cars';
import type { CarsQueryParams } from './types/cars-query-params';

export function useCarsList(params: CarsQueryParams) {
  const query = useQuery({
    queryKey: ['fsd', 'cars', params],
    queryFn: () => {
      return getCars(params);
    },
    placeholderData: keepPreviousData,
  });
  return {
    cars: query.data?.data ?? [],
    pagination: query.data?.meta,
    isLoading: query.isLoading || query.isFetching,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}
