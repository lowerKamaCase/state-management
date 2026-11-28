import { request } from '../../../shared/api/request';
import type {
  Car,
  CarsQueryParams,
  CreateCarInput,
  PaginatedCars,
  UpdateCarInput,
} from '../model/types';

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

export function createCar(input: CreateCarInput): Promise<Car> {
  return request('/cars', { method: 'POST', body: JSON.stringify(input) });
}

export function updateCar(id: string, input: UpdateCarInput): Promise<Car> {
  return request(`/cars/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteCar(id: string): Promise<void> {
  return request(`/cars/${id}`, { method: 'DELETE' });
}
