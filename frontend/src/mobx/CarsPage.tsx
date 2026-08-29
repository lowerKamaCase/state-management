import { Alert, Button, Group, Title } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import {
  CarFormModal,
  CarsFilters,
  CarsPagination,
  CarsTable,
} from '../shared/components';
import type { Car, CreateCarInput, UpdateCarInput } from '../shared/types/car';
import {
  useCars,
  useCarsQueryState,
  useCreateCar,
  useDeleteCar,
  useUpdateCar,
} from './model';

interface ModalState {
  mode: 'create' | 'edit';
  car?: Car;
}

// observer() tracks every MobX observable read performed synchronously
// during this component's render — including reads that happen inside the
// hooks below, since they execute as part of this render. Shared components
// only receive already-dereferenced plain props, so they need no observer()
// wrap of their own.
export const CarsPage = observer(function CarsPage() {
  const qs = useCarsQueryState();
  const list = useCars();
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
  };

  const handleDelete = async (car: Car) => {
    if (window.confirm(`Delete ${car.brand} ${car.model}?`)) {
      await deleteCar(car.id);
    }
  };

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Title order={3}>Cars</Title>
        <Button
          onClick={() => {
            setModalState({ mode: 'create' });
          }}
        >
          Add car
        </Button>
      </Group>

      {list.error && (
        <Alert color="red" mb="md">
          {list.error}
        </Alert>
      )}

      <CarsFilters
        filters={qs.params}
        onChange={qs.setFilters}
        onReset={qs.resetFilters}
      />

      <CarsTable
        cars={list.cars}
        isLoading={list.isLoading}
        sortBy={qs.params.sortBy}
        order={qs.params.order}
        onSortChange={qs.setSort}
        onEdit={(car) => {
          setModalState({ mode: 'edit', car });
        }}
        onDelete={handleDelete}
      />

      <CarsPagination
        meta={list.meta}
        page={qs.params.page}
        pageSize={qs.params.pageSize}
        onPageChange={qs.setPage}
        onPageSizeChange={qs.setPageSize}
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
});
