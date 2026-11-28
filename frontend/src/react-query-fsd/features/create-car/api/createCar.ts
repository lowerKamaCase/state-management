import type { Car, CreateCarInput } from '../../../entities/car';
import { request } from '../../../shared/api/request';

export function createCar(input: CreateCarInput): Promise<Car> {
  return request('/cars', { method: 'POST', body: JSON.stringify(input) });
}
