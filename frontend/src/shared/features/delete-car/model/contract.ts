export interface DeleteCarResult {
  deleteCar: (id: string) => Promise<void>;
  isPending: boolean;
  error: string | null;
}

export interface DeleteCarContract {
  useDeleteCar: () => DeleteCarResult;
}
