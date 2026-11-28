import { request } from '../../../shared/api/request';
import type { PreparationTask, PreparationTaskStatus } from '../model/types';

function taskPath(carId: string) {
  return `/cars/${encodeURIComponent(carId)}/preparation-tasks`;
}

export function getPreparationTasks(carId: string): Promise<PreparationTask[]> {
  return request(taskPath(carId));
}

export function addPreparationTask(
  carId: string,
  title: string,
): Promise<PreparationTask> {
  return request(taskPath(carId), {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

export function setPreparationTaskStatus(
  carId: string,
  taskId: string,
  status: PreparationTaskStatus,
): Promise<PreparationTask> {
  return request(`${taskPath(carId)}/${encodeURIComponent(taskId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
