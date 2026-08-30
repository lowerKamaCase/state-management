import { Alert, Button, Group, Title } from '@mantine/core';
import { useState } from 'react';
import type {
  Car,
  CarsFilters as CarsFiltersType,
  CarSortField,
  CreateCarInput,
  SortOrder,
  UpdateCarInput,
} from '../../shared/entities/car/model/types';
import { CarFormModal } from '../../shared/entities/car/ui/CarFormModal';
import { CarsFilters } from '../../shared/features/filter-cars/ui/CarsFilters';
import { CarsPagination } from '../../shared/features/paginate-cars/ui/CarsPagination';
import { CarsTable } from '../../shared/ui/CarsTable';
import { useCarsList } from '../entities/car/model/store';
import { useCreateCar } from '../features/create-car/model/store';
import { useDeleteCar } from '../features/delete-car/model/store';
import { useFilterCars } from '../features/filter-cars/model/store';
import { usePaginateCars } from '../features/paginate-cars/model/store';
import { useSortCars } from '../features/sort-cars/model/store';
import { useUpdateCar } from '../features/update-car/model/store';

interface ModalState {
  mode: 'create' | 'edit';
  car?: Car;
}

export function CarsPage() {
  const {
    filters,
    setFilters: setFiltersRaw,
    resetFilters: resetFiltersRaw,
  } = useFilterCars();
  const { sortBy, order, setSort: setSortRaw } = useSortCars();
  const { page, pageSize, setPage, setPageSize } = usePaginateCars();

  const setFilters = (patch: Partial<CarsFiltersType>) => {
    setFiltersRaw(patch);
    setPage(1);
  };
  const setSort = (sortBy: CarSortField, order: SortOrder) => {
    setSortRaw(sortBy, order);
    setPage(1);
  };
  const resetFilters = () => {
    resetFiltersRaw();
    setPage(1);
  };

  const list = useCarsList({ ...filters, sortBy, order, page, pageSize });
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
    void list.refetch();
  };

  const handleDelete = async (car: Car) => {
    if (window.confirm(`Delete ${car.brand} ${car.model}?`)) {
      await deleteCar(car.id);
      void list.refetch();
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
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
      />

      <CarsTable
        cars={list.cars}
        isLoading={list.isLoading}
        sortBy={sortBy}
        order={order}
        onSortChange={setSort}
        onEdit={(car) => {
          setModalState({ mode: 'edit', car });
        }}
        onDelete={handleDelete}
      />

      <CarsPagination
        meta={list.meta}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
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
