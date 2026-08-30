import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getCars } from '../../../../shared/entities/car/api/carsApi';
import type { CarsListContract } from '../../../../shared/entities/car/model/contract';
import type { CarsQueryParams } from '../../../../shared/entities/car/model/types';

export function useCarsList(params: CarsQueryParams) {
  const query = useQuery({
    queryKey: ['cars', params],
    queryFn: () => {
      return getCars(params);
    },
    placeholderData: keepPreviousData,
  });
  return {
    cars: query.data?.data ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? (query.error as Error).message : null,
    refetch: query.refetch,
  };
}

const _typecheck: CarsListContract = { useCarsList };
void _typecheck;
