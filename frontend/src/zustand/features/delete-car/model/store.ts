import { create } from 'zustand';
import { deleteCar } from '../../../../shared/entities/car/api/carsApi';
import type { DeleteCarContract } from '../../../../shared/features/delete-car/model/contract';

interface DeleteCarState {
  isPending: boolean;
  deleteCar: (id: string) => Promise<void>;
}

const useDeleteCarStore = create<DeleteCarState>((set) => {
  return {
    isPending: false,
    deleteCar: async (id) => {
      set({ isPending: true });
      try {
        await deleteCar(id);
      } finally {
        set({ isPending: false });
      }
    },
  };
});

export function useDeleteCar() {
  const deleteCarAction = useDeleteCarStore((s) => {
    return s.deleteCar;
  });
  const isPending = useDeleteCarStore((s) => {
    return s.isPending;
  });
  return { deleteCar: deleteCarAction, isPending, error: null };
}

const _typecheck: DeleteCarContract = { useDeleteCar };
void _typecheck;
