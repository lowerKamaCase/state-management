import { useState } from 'react';
import { Alert, Button, Group, Title } from '@mantine/core';
import { CarsFilters, CarsTable, CarsPagination, CarFormModal } from '../shared/components';
import type { Car, CreateCarInput, UpdateCarInput } from '../shared/types/car';
import { useCarsQueryState, useCars, useCreateCar, useUpdateCar, useDeleteCar } from './model';

interface ModalState {
  mode: 'create' | 'edit';
  car?: Car;
}

export function CarsPage() {
  const qs = useCarsQueryState();
  const list = useCars(qs.params); // no global store here, so params must be threaded in explicitly
  const { createCar, isPending: isCreating } = useCreateCar();
  const { updateCar, isPending: isUpdating } = useUpdateCar();
  const { deleteCar } = useDeleteCar();

  const [modalState, setModalState] = useState<ModalState | null>(null);

  const handleSubmit = async (values: CreateCarInput | UpdateCarInput) => {
    if (modalState?.mode === 'edit' && modalState.car) {
      await updateCar(modalState.car.id, values);
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
        <Button onClick={() => setModalState({ mode: 'create' })}>Add car</Button>
      </Group>

      {list.error && (
        <Alert color="red" mb="md">
          {list.error}
        </Alert>
      )}

      <CarsFilters filters={qs.params} onChange={qs.setFilters} onReset={qs.resetFilters} />

      <CarsTable
        cars={list.cars}
        isLoading={list.isLoading}
        sortBy={qs.params.sortBy}
        order={qs.params.order}
        onSortChange={qs.setSort}
        onEdit={(car) => setModalState({ mode: 'edit', car })}
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
        onClose={() => setModalState(null)}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}
