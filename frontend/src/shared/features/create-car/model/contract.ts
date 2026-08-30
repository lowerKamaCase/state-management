import type { CreateCarInput } from '../../../entities/car/model/types';

export interface CreateCarResult {
  createCar: (input: CreateCarInput) => Promise<unknown>;
  isPending: boolean;
  error: string | null;
}

export interface CreateCarContract {
  useCreateCar: () => CreateCarResult;
}
