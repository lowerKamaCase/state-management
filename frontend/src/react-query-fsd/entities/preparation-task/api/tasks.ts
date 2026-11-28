import { request } from '../../../shared/api/request';
import type { PreparationTask } from '../model/types/preparation-task';

function taskPath(carId: string) {
  return `/cars/${encodeURIComponent(carId)}/preparation-tasks`;
}

export function getPreparationTasks(carId: string): Promise<PreparationTask[]> {
  return request(taskPath(carId));
}
