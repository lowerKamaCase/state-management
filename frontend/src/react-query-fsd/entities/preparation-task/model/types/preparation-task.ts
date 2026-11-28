import type { PreparationTaskStatus } from './preparation-task-status';

export interface PreparationTask {
  id: string;
  carId: string;
  title: string;
  status: PreparationTaskStatus;
  createdAt: string;
  updatedAt: string;
}
