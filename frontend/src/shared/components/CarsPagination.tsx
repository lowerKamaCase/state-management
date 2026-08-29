import { Group, Pagination, Select, Text } from '@mantine/core';
import { PAGE_SIZE_OPTIONS, type PaginatedMeta } from '../types/car';

interface CarsPaginationProps {
  meta: PaginatedMeta | undefined;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function CarsPagination({
  meta,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: CarsPaginationProps) {
  return (
    <Group justify="space-between" mt="md">
      <Text size="sm" c="dimmed">
        {meta ? `${meta.total} total` : ''}
      </Text>
      <Pagination
        total={Math.max(meta?.totalPages ?? 1, 1)}
        value={page}
        onChange={onPageChange}
      />
      <Select
        w={100}
        value={String(pageSize)}
        onChange={(value) => {
          return value && onPageSizeChange(Number(value));
        }}
        data={PAGE_SIZE_OPTIONS.map((n) => {
          return { value: String(n), label: `${n} / page` };
        })}
      />
    </Group>
  );
}
