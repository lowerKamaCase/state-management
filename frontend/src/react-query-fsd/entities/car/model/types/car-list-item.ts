import type { Car } from './car';

export interface CarListItem extends Car {
  preparation: { done: number; total: number };
}
