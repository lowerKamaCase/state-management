import type {
  CarListItem,
  CarSortField,
  SortOrder,
} from '../../../entities/car';

const COLUMNS: { key: CarSortField | null; label: string }[] = [
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
  cars: CarListItem[];
  isLoading: boolean;
  sortBy: CarSortField;
  order: SortOrder;
  onSortChange: (sortBy: CarSortField, order: SortOrder) => void;
  onOpenTasks: (car: CarListItem) => void;
  onEdit: (car: CarListItem) => void;
  onDelete: (car: CarListItem) => void;
}

export function CarsTable({
  cars,
  isLoading,
  sortBy,
  order,
  onSortChange,
  onOpenTasks,
  onEdit,
  onDelete,
}: CarsTableProps) {
  const changeSort = (key: CarSortField) => {
    onSortChange(key, key === sortBy && order === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="table-wrap fsd-table-scroll">
      {isLoading && <div className="loading-overlay">Loading…</div>}
      <table className="cars-table">
        <thead>
          <tr>
            {COLUMNS.map((column) => {
              return (
                <th
                  key={column.label}
                  aria-sort={
                    column.key === sortBy
                      ? order === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  {column.key ? (
                    <button
                      type="button"
                      className="fsd-sort-button"
                      onClick={() => {
                        changeSort(column.key as CarSortField);
                      }}
                    >
                      {column.label}
                      {column.key === sortBy
                        ? order === 'asc'
                          ? ' ↑'
                          : ' ↓'
                        : ''}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              );
            })}
            <th>Preparation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => {
            return (
              <tr key={car.id}>
                <td>{car.brand}</td>
                <td>{car.model}</td>
                <td>{car.year}</td>
                <td>${car.price.toLocaleString()}</td>
                <td>{car.mileage.toLocaleString()}</td>
                <td>{car.color}</td>
                <td>{car.bodyType}</td>
                <td>{new Date(car.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-default fsd-tasks-button"
                    onClick={() => {
                      onOpenTasks(car);
                    }}
                    aria-label={`Preparation tasks for ${car.brand} ${car.model}`}
                  >
                    {car.preparation.done}/{car.preparation.total} tasks
                  </button>
                </td>
                <td>
                  <div className="group">
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => {
                        onEdit(car);
                      }}
                      aria-label={`Edit ${car.brand} ${car.model}`}
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      className="btn-icon btn-icon-danger"
                      onClick={() => {
                        onDelete(car);
                      }}
                      aria-label={`Delete ${car.brand} ${car.model}`}
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!isLoading && cars.length === 0 && (
        <p className="empty-text">No cars found</p>
      )}
    </div>
  );
}
