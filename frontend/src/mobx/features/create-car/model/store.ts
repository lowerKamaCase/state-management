import { makeAutoObservable, runInAction } from 'mobx';
import { createCar } from '../../../../shared/entities/car/api/carsApi';
import type { CreateCarInput } from '../../../../shared/entities/car/model/types';
import type { CreateCarContract } from '../../../../shared/features/create-car/model/contract';

class CreateCarStore {
  isPending = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async createCar(input: CreateCarInput) {
    this.isPending = true;
    try {
      await createCar(input);
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
    error: null,
  };
}

const _typecheck: CreateCarContract = { useCreateCar };
void _typecheck;
