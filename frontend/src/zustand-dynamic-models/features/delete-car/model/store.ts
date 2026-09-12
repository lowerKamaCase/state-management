import { useState } from 'react';
import { create } from 'zustand';
import { deleteCar } from '../../../../shared/entities/car/api/carsApi';
import type { DeleteCarContract } from '../../../../shared/features/delete-car/model/contract';

interface DeleteCarState {
  isPending: boolean;
  error: string | null;
  deleteCar: (id: string) => Promise<void>;
}

function createDeleteCarStore() {
  return create<DeleteCarState>((set) => {
    return {
      isPending: false,
      error: null,
      deleteCar: async (id) => {
        set({ isPending: true, error: null });
        try {
          await deleteCar(id);
        } catch (e) {
          set({ error: (e as Error).message });
          throw e;
        } finally {
          set({ isPending: false });
        }
      },
    };
  });
}

export function useDeleteCar() {
  const [useDeleteCarStore] = useState(() => {
    return createDeleteCarStore();
  });
  const deleteCarAction = useDeleteCarStore((s) => {
    return s.deleteCar;
  });
  const isPending = useDeleteCarStore((s) => {
    return s.isPending;
  });
  const error = useDeleteCarStore((s) => {
    return s.error;
  });
  return { deleteCar: deleteCarAction, isPending, error };
}

const _typecheck: DeleteCarContract = { useDeleteCar };
void _typecheck;
