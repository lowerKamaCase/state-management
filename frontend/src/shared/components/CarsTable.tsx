import { Box, LoadingOverlay, Table, Text, ActionIcon, Group } from '@mantine/core';
import type { Car, CarSortField, SortOrder } from '../types/car';

interface Column {
  key: CarSortField | null;
  label: string;
}

const COLUMNS: Column[] = [
  { key: 'brand', label: 'Brand' },
  { key: null, label: 'Model' },
  { key: 'year', label: 'Year' },
  { key: 'price', label: 'Price' },
  { key: 'mileage', label: 'Mileage' },
  { key: null, label: 'Color' },
  { key: null, label: 'Body type' },
  { key: 'createdAt', label: 'Created' },
];

interface CarsTableProps {
  cars: Car[];
  isLoading: boolean;
  sortBy: CarSortField;
  order: SortOrder;
  onSortChange: (sortBy: CarSortField, order: SortOrder) => void;
  onEdit: (car: Car) => void;
  onDelete: (car: Car) => void;
}

export function CarsTable({ cars, isLoading, sortBy, order, onSortChange, onEdit, onDelete }: CarsTableProps) {
  const handleHeaderClick = (key: CarSortField) => {
    if (key === sortBy) {
      onSortChange(key, order === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(key, 'asc');
    }
  };

  return (
    <Box pos="relative" mih={200}>
      <LoadingOverlay visible={isLoading} zIndex={10} overlayProps={{ radius: 'sm', blur: 1 }} />
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            {COLUMNS.map((col) => (
              <Table.Th
                key={col.label}
                onClick={col.key ? () => handleHeaderClick(col.key as CarSortField) : undefined}
                style={col.key ? { cursor: 'pointer', userSelect: 'none' } : undefined}
              >
                {col.label}
                {col.key === sortBy ? (order === 'asc' ? ' ↑' : ' ↓') : ''}
              </Table.Th>
            ))}
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {cars.map((car) => (
            <Table.Tr key={car.id}>
              <Table.Td>{car.brand}</Table.Td>
              <Table.Td>{car.model}</Table.Td>
              <Table.Td>{car.year}</Table.Td>
              <Table.Td>${car.price.toLocaleString()}</Table.Td>
              <Table.Td>{car.mileage.toLocaleString()}</Table.Td>
              <Table.Td>{car.color}</Table.Td>
              <Table.Td>{car.bodyType}</Table.Td>
              <Table.Td>{new Date(car.createdAt).toLocaleDateString()}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon variant="subtle" onClick={() => onEdit(car)} aria-label="Edit">
                    ✎
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" onClick={() => onDelete(car)} aria-label="Delete">
                    ✕
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      {!isLoading && cars.length === 0 && (
        <Text ta="center" c="dimmed" py="lg">
          No cars found
        </Text>
      )}
    </Box>
  );
}
