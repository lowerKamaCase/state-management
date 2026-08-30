import type { Car, CarsQueryParams, PaginatedMeta } from './types';

export interface CarsListResult {
  cars: Car[];
  meta: PaginatedMeta | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  refetch: () => void;
}

export interface CarsListContract {
  useCarsList: (params: CarsQueryParams) => CarsListResult;
}
