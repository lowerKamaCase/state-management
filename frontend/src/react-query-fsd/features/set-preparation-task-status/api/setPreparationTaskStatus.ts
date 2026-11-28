import type {
  PreparationTask,
  PreparationTaskStatus,
} from '../../../entities/preparation-task';
import { request } from '../../../shared/api/request';

export function setPreparationTaskStatus(
  carId: string,
  taskId: string,
  status: PreparationTaskStatus,
): Promise<PreparationTask> {
  return request(
    `/cars/${encodeURIComponent(carId)}/preparation-tasks/${encodeURIComponent(taskId)}`,
    { method: 'PATCH', body: JSON.stringify({ status }) },
  );
}
