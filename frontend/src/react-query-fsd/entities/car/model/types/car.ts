import type { BodyType } from './body-type';

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
