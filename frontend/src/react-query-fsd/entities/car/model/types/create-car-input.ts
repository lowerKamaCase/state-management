import type { Car } from './car';

export type CreateCarInput = Pick<
  Car,
  'brand' | 'model' | 'year' | 'price' | 'mileage' | 'color' | 'bodyType'
>;
