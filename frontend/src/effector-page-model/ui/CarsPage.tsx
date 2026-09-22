import { useState } from 'react';
import { useCreateCar } from '../../effector/features/create-car/model/store';
import { useDeleteCar } from '../../effector/features/delete-car/model/store';
import { useUpdateCar } from '../../effector/features/update-car/model/store';
import type {
  Car,
  CreateCarInput,
  UpdateCarInput,
} from '../../shared/entities/car/model/types';
import { CarFormModal } from '../../shared/entities/car/ui/CarFormModal';
import { CarsFilters } from '../../shared/features/filter-cars/ui/CarsFilters';
import { CarsPagination } from '../../shared/features/paginate-cars/ui/CarsPagination';
import { CarsTable } from '../../shared/ui/CarsTable';
import { useCarsPageModel } from '../model/store';

interface ModalState {
  mode: 'create' | 'edit';
  car?: Car;
}

export function CarsPage() {
  const model = useCarsPageModel();
  const { createCar, isPending: isCreating } = useCreateCar();
  const { updateCar, isPending: isUpdating } = useUpdateCar();
  const { deleteCar } = useDeleteCar();

  const [modalState, setModalState] = useState<ModalState | null>(null);

  const handleSubmit = async (values: CreateCarInput | UpdateCarInput) => {
    if (modalState?.mode === 'edit' && modalState.car) {
      await updateCar({ id: modalState.car.id, input: values });
    } else {
      await createCar(values as CreateCarInput);
    }
    model.refetch();
  };

  const handleDelete = async (car: Car) => {
    if (window.confirm(`Delete ${car.brand} ${car.model}?`)) {
      try {
        await deleteCar(car.id);
        model.refetch();
      } catch (e) {
        window.alert((e as Error).message);
      }
    }
  };

  return (
    <div>
      <div className="group-between">
        <h3 className="page-title">Cars</h3>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setModalState({ mode: 'create' });
          }}
        >
          Add car
        </button>
      </div>

      {model.error && <div className="alert alert-mb">{model.error}</div>}

      <CarsFilters
        filters={model.filters}
        onChange={model.setFilters}
        onReset={model.resetFilters}
      />

      <CarsTable
        cars={model.cars}
        isLoading={model.isLoading}
        sortBy={model.sortBy}
        order={model.order}
        onSortChange={model.setSort}
        onEdit={(car) => {
          setModalState({ mode: 'edit', car });
        }}
        onDelete={handleDelete}
      />

      <CarsPagination
        meta={model.meta}
        page={model.page}
        pageSize={model.pageSize}
        onPageChange={model.setPage}
        onPageSizeChange={model.setPageSize}
      />

      <CarFormModal
        opened={modalState !== null}
        mode={modalState?.mode ?? 'create'}
        initialValues={modalState?.car}
        onClose={() => {
          setModalState(null);
        }}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}
