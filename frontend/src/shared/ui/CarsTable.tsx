import type { Car, CarSortField, SortOrder } from '../entities/car/model/types';

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

export function CarsTable({
  cars,
  isLoading,
  sortBy,
  order,
  onSortChange,
  onEdit,
  onDelete,
}: CarsTableProps) {
  const handleHeaderClick = (key: CarSortField) => {
    if (key === sortBy) {
      onSortChange(key, order === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(key, 'asc');
    }
  };

  return (
    <div className="table-wrap">
      {isLoading && <div className="loading-overlay">Loading…</div>}
      <table className="cars-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => {
              return (
                <th
                  key={col.label}
                  className={col.key ? 'sortable' : undefined}
                  onClick={
                    col.key
                      ? () => {
                          handleHeaderClick(col.key as CarSortField);
                        }
                      : undefined
                  }
                >
                  {col.label}
                  {col.key === sortBy ? (order === 'asc' ? ' ↑' : ' ↓') : ''}
                </th>
              );
            })}
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
                  <div className="group">
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => {
                        onEdit(car);
                      }}
                      aria-label="Edit"
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      className="btn-icon btn-icon-danger"
                      onClick={() => {
                        onDelete(car);
                      }}
                      aria-label="Delete"
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
