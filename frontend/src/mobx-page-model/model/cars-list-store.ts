import { makeAutoObservable, runInAction } from 'mobx';
import { getCars } from '../../shared/entities/car/api/carsApi';
import type {
  Car,
  CarsQueryParams,
  PaginatedMeta,
} from '../../shared/entities/car/model/types';

export class CarsListStore {
  cars: Car[] = [];
  meta: PaginatedMeta | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchCars(params: CarsQueryParams) {
    this.isLoading = true;
    this.error = null;
    try {
      const res = await getCars(params);
      runInAction(() => {
        this.cars = res.data;
        this.meta = res.meta;
        this.isLoading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.error = (e as Error).message;
        this.isLoading = false;
      });
    }
  }
}
