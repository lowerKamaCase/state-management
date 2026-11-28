import type { CarListItem } from './car-list-item';

export interface PaginatedCars {
  data: CarListItem[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}
