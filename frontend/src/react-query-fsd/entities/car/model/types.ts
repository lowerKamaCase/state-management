export type BodyType =
  | 'SEDAN'
  | 'SUV'
  | 'HATCHBACK'
  | 'COUPE'
  | 'WAGON'
  | 'PICKUP'
  | 'VAN'
  | 'CONVERTIBLE';

export const BODY_TYPES: BodyType[] = [
  'SEDAN',
  'SUV',
  'HATCHBACK',
  'COUPE',
  'WAGON',
  'PICKUP',
  'VAN',
  'CONVERTIBLE',
];

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  bodyType: BodyType;
  createdAt: string;
  updatedAt: string;
}

export interface CarListItem extends Car {
  preparation: { done: number; total: number };
}

export type CarSortField = 'price' | 'year' | 'mileage' | 'createdAt' | 'brand';
export type SortOrder = 'asc' | 'desc';

export interface CarsFilters {
  brand?: string;
  bodyType?: BodyType;
  color?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface CarsQueryParams {
  filters: CarsFilters;
  sortBy: CarSortField;
  order: SortOrder;
  page: number;
  pageSize: number;
}

export interface PaginatedCars {
  data: CarListItem[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}

export type CreateCarInput = Pick<
  Car,
  'brand' | 'model' | 'year' | 'price' | 'mileage' | 'color' | 'bodyType'
>;
export type UpdateCarInput = Partial<CreateCarInput>;
