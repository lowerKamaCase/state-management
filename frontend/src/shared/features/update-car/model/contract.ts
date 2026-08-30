import type { UpdateCarInput } from '../../../entities/car/model/types';

export interface UpdateCarResult {
  updateCar: (payload: {
    id: string;
    input: UpdateCarInput;
  }) => Promise<unknown>;
  isPending: boolean;
  error: string | null;
}

export interface UpdateCarContract {
  useUpdateCar: () => UpdateCarResult;
}
