const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

interface PaginationInfo {
  total: number;
  totalPages: number;
}

interface CarsPaginationProps {
  pagination: PaginationInfo | undefined;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function CarsPagination({
  pagination,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: CarsPaginationProps) {
  const totalPages = Math.max(pagination?.totalPages ?? 1, 1);
  const pages = Array.from({ length: totalPages }, (_, i) => {
    return i + 1;
  });

  return (
    <div className="group-between" style={{ marginTop: 16, marginBottom: 0 }}>
      <span className="text-dim">
        {pagination ? `${pagination.total} total` : ''}
      </span>
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
          aria-label="Page size"
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
