import type {
  Car,
  CarsQueryParams,
  CreateCarInput,
  PaginatedCars,
  UpdateCarInput,
} from '../model/types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = Array.isArray(body?.message)
        ? body.message.join(', ')
        : (body?.message ?? message);
    } catch {
      // non-JSON error body, keep default message
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

function toQueryString(params: CarsQueryParams): string {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      usp.set(key, String(value));
    }
  });
  return usp.toString();
}

export const getCars = (params: CarsQueryParams): Promise<PaginatedCars> => {
  return request(`/cars?${toQueryString(params)}`);
};

export const getCar = (id: string): Promise<Car> => {
  return request(`/cars/${id}`);
};

export const createCar = (input: CreateCarInput): Promise<Car> => {
  return request('/cars', { method: 'POST', body: JSON.stringify(input) });
};

export const updateCar = (payload: {
  id: string;
  input: UpdateCarInput;
}): Promise<Car> => {
  const { id, input } = payload;
  return request(`/cars/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
};

export const deleteCar = (id: string): Promise<void> => {
  return request(`/cars/${id}`, { method: 'DELETE' });
};
