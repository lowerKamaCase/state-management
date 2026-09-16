import {
  PAGE_SIZE_OPTIONS,
  type PaginatedMeta,
} from '../../../entities/car/model/types';

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
  const totalPages = Math.max(meta?.totalPages ?? 1, 1);
  const pages = Array.from({ length: totalPages }, (_, i) => {
    return i + 1;
  });

  return (
    <div className="group-between" style={{ marginTop: 16, marginBottom: 0 }}>
      <span className="text-dim">{meta ? `${meta.total} total` : ''}</span>
      <div className="pagination">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => {
            onPageChange(page - 1);
          }}
        >
          Prev
        </button>
        {pages.map((p) => {
          return (
            <button
              key={p}
              type="button"
              className={p === page ? 'active' : undefined}
              onClick={() => {
                onPageChange(p);
              }}
            >
              {p}
            </button>
          );
        })}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => {
            onPageChange(page + 1);
          }}
        >
          Next
        </button>
      </div>
      <div className="field" style={{ width: 100 }}>
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.currentTarget.value));
          }}
        >
          {PAGE_SIZE_OPTIONS.map((n) => {
            return (
              <option key={n} value={n}>
                {n} / page
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
