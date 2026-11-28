import type { Car, UpdateCarInput } from '../../../entities/car';
import { request } from '../../../shared/api/request';

export function updateCar(id: string, input: UpdateCarInput): Promise<Car> {
  return request(`/cars/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
