import { useEffect, useState } from 'react';
import {
  BODY_TYPES,
  type BodyType,
  type CarsFilters as CarsFiltersType,
} from '../../../entities/car/model/types';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';

interface CarsFiltersProps {
  filters: CarsFiltersType;
  onChange: (patch: Partial<CarsFiltersType>) => void;
  onReset: () => void;
}

export function CarsFilters({ filters, onChange, onReset }: CarsFiltersProps) {
  const [brand, setBrand] = useState(filters.brand ?? '');
  const [color, setColor] = useState(filters.color ?? '');
  const [search, setSearch] = useState(filters.search ?? '');

  const [debouncedBrand] = useDebouncedValue(brand, 300);
  const [debouncedColor] = useDebouncedValue(color, 300);
  const [debouncedSearch] = useDebouncedValue(search, 300);

  useEffect(() => {
    if (debouncedBrand !== (filters.brand ?? '')) {
      onChange({ brand: debouncedBrand || undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedBrand]);

  useEffect(() => {
    if (debouncedColor !== (filters.color ?? '')) {
      onChange({ color: debouncedColor || undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedColor]);

  useEffect(() => {
    if (debouncedSearch !== (filters.search ?? '')) {
      onChange({ search: debouncedSearch || undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleReset = () => {
    setBrand('');
    setColor('');
    setSearch('');
    onReset();
  };

  return (
    <div className="group" style={{ marginBottom: 16 }}>
      <div className="field" style={{ width: 140 }}>
        <label>Brand</label>
        <input
          value={brand}
          onChange={(e) => {
            setBrand(e.currentTarget.value);
          }}
        />
      </div>
      <div className="field" style={{ width: 120 }}>
        <label>Color</label>
        <input
          value={color}
          onChange={(e) => {
            setColor(e.currentTarget.value);
          }}
        />
      </div>
      <div className="field" style={{ width: 160 }}>
        <label>Search</label>
        <input
          placeholder="brand or model"
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
          }}
        />
      </div>
      <div className="field" style={{ width: 140 }}>
        <label>Body type</label>
        <select
          value={filters.bodyType ?? ''}
          onChange={(e) => {
            onChange({
              bodyType: (e.currentTarget.value as BodyType) || undefined,
            });
          }}
        >
          <option value="">All</option>
          {BODY_TYPES.map((t) => {
            return (
              <option key={t} value={t}>
                {t}
              </option>
            );
          })}
        </select>
      </div>
      <div className="field" style={{ width: 100 }}>
        <label>Min year</label>
        <input
          type="number"
          value={filters.minYear ?? ''}
          onChange={(e) => {
            const v = e.currentTarget.value;
            onChange({ minYear: v === '' ? undefined : Number(v) });
          }}
        />
      </div>
      <div className="field" style={{ width: 100 }}>
        <label>Max year</label>
        <input
          type="number"
          value={filters.maxYear ?? ''}
          onChange={(e) => {
            const v = e.currentTarget.value;
            onChange({ maxYear: v === '' ? undefined : Number(v) });
          }}
        />
      </div>
      <div className="field" style={{ width: 110 }}>
        <label>Min price</label>
        <input
          type="number"
          value={filters.minPrice ?? ''}
          onChange={(e) => {
            const v = e.currentTarget.value;
            onChange({ minPrice: v === '' ? undefined : Number(v) });
          }}
        />
      </div>
      <div className="field" style={{ width: 110 }}>
        <label>Max price</label>
        <input
          type="number"
          value={filters.maxPrice ?? ''}
          onChange={(e) => {
            const v = e.currentTarget.value;
            onChange({ maxPrice: v === '' ? undefined : Number(v) });
          }}
        />
      </div>
      <button type="button" className="btn btn-default" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
}
