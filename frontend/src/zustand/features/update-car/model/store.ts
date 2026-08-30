import { create } from 'zustand';
import { updateCar } from '../../../../shared/entities/car/api/carsApi';
import type { UpdateCarInput } from '../../../../shared/entities/car/model/types';
import type { UpdateCarContract } from '../../../../shared/features/update-car/model/contract';

interface UpdateCarState {
  isPending: boolean;
  updateCar: (payload: { id: string; input: UpdateCarInput }) => Promise<void>;
}

const useUpdateCarStore = create<UpdateCarState>((set) => {
  return {
    isPending: false,
    updateCar: async (payload) => {
      set({ isPending: true });
      try {
        await updateCar(payload);
      } finally {
        set({ isPending: false });
      }
    },
  };
});

export function useUpdateCar() {
  const updateCarAction = useUpdateCarStore((s) => {
    return s.updateCar;
  });
  const isPending = useUpdateCarStore((s) => {
    return s.isPending;
  });
  return { updateCar: updateCarAction, isPending, error: null };
}

const _typecheck: UpdateCarContract = { useUpdateCar };
void _typecheck;
