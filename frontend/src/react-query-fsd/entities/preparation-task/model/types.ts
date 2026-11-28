export type PreparationTaskStatus = 'OPEN' | 'DONE';

export interface PreparationTask {
  id: string;
  carId: string;
  title: string;
  status: PreparationTaskStatus;
  createdAt: string;
  updatedAt: string;
}
