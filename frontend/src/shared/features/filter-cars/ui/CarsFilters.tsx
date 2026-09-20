import { useEffect, useId, useState } from 'react';
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
  const uid = useId();
  const fieldId = (name: string) => {
    return `${uid}-${name}`;
  };

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
        <label htmlFor={fieldId('brand')}>Brand</label>
        <input
          id={fieldId('brand')}
          value={brand}
          onChange={(e) => {
            setBrand(e.currentTarget.value);
          }}
        />
      </div>
      <div className="field" style={{ width: 120 }}>
        <label htmlFor={fieldId('color')}>Color</label>
        <input
          id={fieldId('color')}
          value={color}
          onChange={(e) => {
            setColor(e.currentTarget.value);
          }}
        />
      </div>
      <div className="field" style={{ width: 160 }}>
        <label htmlFor={fieldId('search')}>Search</label>
        <input
          id={fieldId('search')}
          placeholder="brand or model"
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
          }}
        />
      </div>
      <div className="field" style={{ width: 140 }}>
        <label htmlFor={fieldId('bodyType')}>Body type</label>
        <select
          id={fieldId('bodyType')}
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
        <label htmlFor={fieldId('minYear')}>Min year</label>
        <input
          id={fieldId('minYear')}
          type="number"
          value={filters.minYear ?? ''}
          onChange={(e) => {
            const v = e.currentTarget.value;
            onChange({ minYear: v === '' ? undefined : Number(v) });
          }}
        />
      </div>
      <div className="field" style={{ width: 100 }}>
        <label htmlFor={fieldId('maxYear')}>Max year</label>
        <input
          id={fieldId('maxYear')}
          type="number"
          value={filters.maxYear ?? ''}
          onChange={(e) => {
            const v = e.currentTarget.value;
            onChange({ maxYear: v === '' ? undefined : Number(v) });
          }}
        />
      </div>
      <div className="field" style={{ width: 110 }}>
        <label htmlFor={fieldId('minPrice')}>Min price</label>
        <input
          id={fieldId('minPrice')}
          type="number"
          value={filters.minPrice ?? ''}
          onChange={(e) => {
            const v = e.currentTarget.value;
            onChange({ minPrice: v === '' ? undefined : Number(v) });
          }}
        />
      </div>
      <div className="field" style={{ width: 110 }}>
        <label htmlFor={fieldId('maxPrice')}>Max price</label>
        <input
          id={fieldId('maxPrice')}
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
