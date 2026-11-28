import type { PreparationTask } from '../../../entities/preparation-task';
import { request } from '../../../shared/api/request';

export function addPreparationTask(
  carId: string,
  title: string,
): Promise<PreparationTask> {
  return request(`/cars/${encodeURIComponent(carId)}/preparation-tasks`, {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}
