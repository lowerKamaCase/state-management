import type {
  Car,
  CreateCarInput,
  UpdateCarInput,
} from '../../../entities/car';
import { useCreateCar } from '../../../features/create-car';
import { useUpdateCar } from '../../../features/update-car';
import { CarFormModal } from './CarFormModal';

interface CarEditorProps {
  mode: 'create' | 'edit';
  car?: Car;
  onClose: () => void;
  onSaved: () => void;
}

export function CarEditor({ mode, car, onClose, onSaved }: CarEditorProps) {
  const create = useCreateCar({ onSuccess: onSaved });
  const update = useUpdateCar({ onSuccess: onSaved });

  const save = async (values: CreateCarInput | UpdateCarInput) => {
    if (mode === 'edit' && car) {
      await update.updateCar({ id: car.id, input: values });
    } else {
      await create.createCar(values as CreateCarInput);
    }
  };

  return (
    <CarFormModal
      opened
      mode={mode}
      initialValues={car}
      onClose={onClose}
      onSubmit={save}
      isSubmitting={create.isPending || update.isPending}
    />
  );
}
