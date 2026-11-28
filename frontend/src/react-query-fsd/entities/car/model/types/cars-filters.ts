import type { BodyType } from './body-type';

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
