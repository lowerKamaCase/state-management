import { useEffect, useState } from 'react';
import { Group, TextInput, Select, NumberInput, Button } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { BODY_TYPES } from '../types/car';
import type { CarsFilters as CarsFiltersType, BodyType } from '../types/car';

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
    if (debouncedBrand !== (filters.brand ?? '')) onChange({ brand: debouncedBrand || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedBrand]);

  useEffect(() => {
    if (debouncedColor !== (filters.color ?? '')) onChange({ color: debouncedColor || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedColor]);

  useEffect(() => {
    if (debouncedSearch !== (filters.search ?? '')) onChange({ search: debouncedSearch || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleReset = () => {
    setBrand('');
    setColor('');
    setSearch('');
    onReset();
  };

  return (
    <Group gap="sm" wrap="wrap" align="flex-end" mb="md">
      <TextInput label="Brand" value={brand} onChange={(e) => setBrand(e.currentTarget.value)} w={140} />
      <TextInput label="Color" value={color} onChange={(e) => setColor(e.currentTarget.value)} w={120} />
      <TextInput label="Search" placeholder="brand or model" value={search} onChange={(e) => setSearch(e.currentTarget.value)} w={160} />
      <Select
        label="Body type"
        placeholder="All"
        clearable
        data={BODY_TYPES}
        value={filters.bodyType ?? null}
        onChange={(value) => onChange({ bodyType: (value as BodyType) || undefined })}
        w={140}
      />
      <NumberInput
        label="Min year"
        value={filters.minYear ?? ''}
        onChange={(value) => onChange({ minYear: value === '' ? undefined : Number(value) })}
        w={100}
      />
      <NumberInput
        label="Max year"
        value={filters.maxYear ?? ''}
        onChange={(value) => onChange({ maxYear: value === '' ? undefined : Number(value) })}
        w={100}
      />
      <NumberInput
        label="Min price"
        value={filters.minPrice ?? ''}
        onChange={(value) => onChange({ minPrice: value === '' ? undefined : Number(value) })}
        w={110}
      />
      <NumberInput
        label="Max price"
        value={filters.maxPrice ?? ''}
        onChange={(value) => onChange({ maxPrice: value === '' ? undefined : Number(value) })}
        w={110}
      />
      <Button variant="default" onClick={handleReset}>
        Reset
      </Button>
    </Group>
  );
}
