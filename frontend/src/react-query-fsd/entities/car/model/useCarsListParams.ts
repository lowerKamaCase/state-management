import { useState } from 'react';
import type { CarSortField } from './types/car-sort-field';
import type { CarsFilters } from './types/cars-filters';
import type { CarsQueryParams } from './types/cars-query-params';
import type { SortOrder } from './types/sort-order';

export function useCarsListParams() {
  const [params, setParams] = useState<CarsQueryParams>({
    filters: {},
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    pageSize: 20,
  });

  return {
    ...params,
    queryParams: params,
    changeFilters: (patch: Partial<CarsFilters>) => {
      setParams((current) => {
        return {
          ...current,
          filters: { ...current.filters, ...patch },
          page: 1,
        };
      });
    },
    resetFilters: () => {
      setParams((current) => {
        return { ...current, filters: {}, page: 1 };
      });
    },
    changeSort: (sortBy: CarSortField, order: SortOrder) => {
      setParams((current) => {
        return { ...current, sortBy, order, page: 1 };
      });
    },
    changePage: (page: number) => {
      setParams((current) => {
        return { ...current, page };
      });
    },
    changePageSize: (pageSize: number) => {
      setParams((current) => {
        return { ...current, pageSize, page: 1 };
      });
    },
  };
}
