import { useState } from 'react';
import { create } from 'zustand';
import { createCar } from '../../../../shared/entities/car/api/carsApi';
import type { CreateCarInput } from '../../../../shared/entities/car/model/types';
import type { CreateCarContract } from '../../../../shared/features/create-car/model/contract';

interface CreateCarState {
  isPending: boolean;
  error: string | null;
  createCar: (input: CreateCarInput) => Promise<void>;
}

function createCreateCarStore() {
  return create<CreateCarState>((set) => {
    return {
      isPending: false,
      error: null,
      createCar: async (input) => {
        set({ isPending: true, error: null });
        try {
          await createCar(input);
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

export function useCreateCar() {
  const [useCreateCarStore] = useState(() => {
    return createCreateCarStore();
  });
  const createCarAction = useCreateCarStore((s) => {
    return s.createCar;
  });
  const isPending = useCreateCarStore((s) => {
    return s.isPending;
  });
  const error = useCreateCarStore((s) => {
    return s.error;
  });
  return { createCar: createCarAction, isPending, error };
}

const _typecheck: CreateCarContract = { useCreateCar };
void _typecheck;
