import type {
  CarListItem,
  CarsFilters as CarsFiltersType,
  CarSortField,
  SortOrder,
} from '../../../entities/car';
import { CarsFilters } from './CarsFilters';
import { CarsPagination } from './CarsPagination';
import { CarsTable } from './CarsTable';

interface CarsCatalogProps {
  cars: CarListItem[];
  loading: boolean;
  filters: CarsFiltersType;
  onFiltersChange: (patch: Partial<CarsFiltersType>) => void;
  onFiltersReset: () => void;
  sortBy: CarSortField;
  order: SortOrder;
  onSortChange: (sortBy: CarSortField, order: SortOrder) => void;
  pagination?: { total: number; totalPages: number };
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onOpenTasks: (car: CarListItem) => void;
  onEdit: (car: CarListItem) => void;
  onDelete: (car: CarListItem) => void;
}

export function CarsCatalog({
  cars,
  loading,
  filters,
  onFiltersChange,
  onFiltersReset,
  sortBy,
  order,
  onSortChange,
  pagination,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onOpenTasks,
  onEdit,
  onDelete,
}: CarsCatalogProps) {
  return (
    <>
      <CarsFilters
        filters={filters}
        onChange={onFiltersChange}
        onReset={onFiltersReset}
      />
      <CarsTable
        cars={cars}
        isLoading={loading}
        sortBy={sortBy}
        order={order}
        onSortChange={onSortChange}
        onOpenTasks={onOpenTasks}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <CarsPagination
        pagination={pagination}
        page={page}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </>
  );
}
