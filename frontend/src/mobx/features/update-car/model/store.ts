import { makeAutoObservable, runInAction } from 'mobx';
import { updateCar } from '../../../../shared/entities/car/api/carsApi';
import type { UpdateCarInput } from '../../../../shared/entities/car/model/types';
import type { UpdateCarContract } from '../../../../shared/features/update-car/model/contract';

class UpdateCarStore {
  isPending = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async updateCar(payload: { id: string; input: UpdateCarInput }) {
    this.isPending = true;
    try {
      await updateCar(payload);
    } finally {
      runInAction(() => {
        this.isPending = false;
      });
    }
  }
}

const updateCarStore = new UpdateCarStore();

export function useUpdateCar() {
  return {
    // oxlint-disable-next-line typescript/unbound-method -- autoBind: true (see constructor)
    updateCar: updateCarStore.updateCar,
    isPending: updateCarStore.isPending,
    error: null,
  };
}

const _typecheck: UpdateCarContract = { useUpdateCar };
void _typecheck;
