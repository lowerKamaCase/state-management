import { useState } from 'react';
import { create } from 'zustand';
import { updateCar } from '../../../../shared/entities/car/api/carsApi';
import type { UpdateCarInput } from '../../../../shared/entities/car/model/types';
import type { UpdateCarContract } from '../../../../shared/features/update-car/model/contract';

interface UpdateCarState {
  isPending: boolean;
  error: string | null;
  updateCar: (payload: { id: string; input: UpdateCarInput }) => Promise<void>;
}

function createUpdateCarStore() {
  return create<UpdateCarState>((set) => {
    return {
      isPending: false,
      error: null,
      updateCar: async (payload) => {
        set({ isPending: true, error: null });
        try {
          await updateCar(payload);
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

export function useUpdateCar() {
  const [useUpdateCarStore] = useState(() => {
    return createUpdateCarStore();
  });
  const updateCarAction = useUpdateCarStore((s) => {
    return s.updateCar;
  });
  const isPending = useUpdateCarStore((s) => {
    return s.isPending;
  });
  const error = useUpdateCarStore((s) => {
    return s.error;
  });
  return { updateCar: updateCarAction, isPending, error };
}

const _typecheck: UpdateCarContract = { useUpdateCar };
void _typecheck;
