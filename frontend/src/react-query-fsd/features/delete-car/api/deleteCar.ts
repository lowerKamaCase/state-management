import { request } from '../../../shared/api/request';

export function deleteCar(id: string): Promise<void> {
  return request(`/cars/${id}`, { method: 'DELETE' });
}
