import { request } from '../../../shared/api/request';
import type { CarsQueryParams } from '../model/types/cars-query-params';
import type { PaginatedCars } from '../model/types/paginated-cars';

export function getCars(params: CarsQueryParams): Promise<PaginatedCars> {
  const query = new URLSearchParams();
  const { filters, ...listOptions } = params;
  Object.entries({ ...filters, ...listOptions }).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  });
  return request(`/cars?${query}`);
}
