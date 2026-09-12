import { makeAutoObservable, runInAction } from 'mobx';
import { createCar } from '../../../../shared/entities/car/api/carsApi';
import type { CreateCarInput } from '../../../../shared/entities/car/model/types';
import type { CreateCarContract } from '../../../../shared/features/create-car/model/contract';

class CreateCarStore {
  isPending = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async createCar(input: CreateCarInput) {
    this.isPending = true;
    this.error = null;
    try {
      await createCar(input);
    } catch (e) {
      runInAction(() => {
        this.error = (e as Error).message;
      });
      throw e;
    } finally {
      runInAction(() => {
        this.isPending = false;
      });
    }
  }
}

const createCarStore = new CreateCarStore();

export function useCreateCar() {
  return {
    // oxlint-disable-next-line typescript/unbound-method -- autoBind: true (see constructor)
    createCar: createCarStore.createCar,
    isPending: createCarStore.isPending,
    error: createCarStore.error,
  };
}

const _typecheck: CreateCarContract = { useCreateCar };
void _typecheck;
