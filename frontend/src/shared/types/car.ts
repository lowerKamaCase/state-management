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

export type CarSortField = 'price' | 'year' | 'mileage' | 'createdAt' | 'brand';
export type SortOrder = 'asc' | 'desc';

export const SORT_FIELDS: CarSortField[] = [
  'price',
  'year',
  'mileage',
  'createdAt',
  'brand',
];

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

export interface CarsQueryParams extends CarsFilters {
  page: number;
  pageSize: number;
  sortBy: CarSortField;
  order: SortOrder;
}

export interface PaginatedMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedCars {
  data: Car[];
  meta: PaginatedMeta;
}

export type CreateCarInput = Omit<Car, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCarInput = Partial<CreateCarInput>;

export const DEFAULT_QUERY_PARAMS: CarsQueryParams = {
  page: 1,
  pageSize: 20,
  sortBy: 'createdAt',
  order: 'desc',
};

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
