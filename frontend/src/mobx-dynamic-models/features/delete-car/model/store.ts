import { makeAutoObservable, runInAction } from 'mobx';
import { useState } from 'react';
import { deleteCar } from '../../../../shared/entities/car/api/carsApi';
import type { DeleteCarContract } from '../../../../shared/features/delete-car/model/contract';

class DeleteCarStore {
  isPending = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async deleteCar(id: string) {
    this.isPending = true;
    this.error = null;
    try {
      await deleteCar(id);
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

export function useDeleteCar() {
  const [deleteCarStore] = useState(() => {
    return new DeleteCarStore();
  });
  return {
    // oxlint-disable-next-line typescript/unbound-method -- autoBind: true (see constructor)
    deleteCar: deleteCarStore.deleteCar,
    isPending: deleteCarStore.isPending,
    error: deleteCarStore.error,
  };
}

const _typecheck: DeleteCarContract = { useDeleteCar };
void _typecheck;
