import { create } from 'zustand';
import { createCar } from '../../../../shared/entities/car/api/carsApi';
import type { CreateCarInput } from '../../../../shared/entities/car/model/types';
import type { CreateCarContract } from '../../../../shared/features/create-car/model/contract';

interface CreateCarState {
  isPending: boolean;
  createCar: (input: CreateCarInput) => Promise<void>;
}

const useCreateCarStore = create<CreateCarState>((set) => {
  return {
    isPending: false,
    createCar: async (input) => {
      set({ isPending: true });
      try {
        await createCar(input);
      } finally {
        set({ isPending: false });
      }
    },
  };
});

export function useCreateCar() {
  const createCarAction = useCreateCarStore((s) => {
    return s.createCar;
  });
  const isPending = useCreateCarStore((s) => {
    return s.isPending;
  });
  return { createCar: createCarAction, isPending, error: null };
}

const _typecheck: CreateCarContract = { useCreateCar };
void _typecheck;
