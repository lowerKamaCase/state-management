import { useState } from 'react';
import {
  useCarsList,
  useCarsListParams,
  type CarListItem,
} from '../../../entities/car';
import { DeleteCarDialog } from '../../../features/delete-car';
import { CarsCatalog } from '../../../widgets/car-catalog';
import { CarEditor } from '../../../widgets/car-editor';
import { PreparationDialog } from '../../../widgets/preparation-dialog';

type EditorState = { mode: 'create' } | { mode: 'edit'; car: CarListItem };

export function CarsPage() {
  const listParams = useCarsListParams();
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [tasksCar, setTasksCar] = useState<CarListItem | null>(null);
  const [carToDelete, setCarToDelete] = useState<CarListItem | null>(null);

  const list = useCarsList(listParams.queryParams);

  const handleCarDeleted = () => {
    setCarToDelete(null);
    if (list.cars.length === 1 && listParams.page > 1) {
      listParams.changePage(listParams.page - 1);
    } else {
      void list.refetch();
    }
  };

  return (
    <div>
      <div className="group-between">
        <h3 className="page-title">Cars · React Query + FSD</h3>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setEditor({ mode: 'create' });
          }}
        >
          Add car
        </button>
      </div>

      {list.error && (
        <div className="alert alert-mb" role="alert">
          {list.error}
        </div>
      )}
      <CarsCatalog
        cars={list.cars}
        loading={list.isLoading}
        filters={listParams.filters}
        onFiltersChange={listParams.changeFilters}
        onFiltersReset={listParams.resetFilters}
        sortBy={listParams.sortBy}
        order={listParams.order}
        onSortChange={listParams.changeSort}
        pagination={list.pagination}
        page={listParams.page}
        pageSize={listParams.pageSize}
        onPageChange={listParams.changePage}
        onPageSizeChange={listParams.changePageSize}
        onOpenTasks={setTasksCar}
        onEdit={(car) => {
          setEditor({ mode: 'edit', car });
        }}
        onDelete={setCarToDelete}
      />

      {carToDelete && (
        <DeleteCarDialog
          carId={carToDelete.id}
          carName={`${carToDelete.brand} ${carToDelete.model}`}
          onClose={() => {
            setCarToDelete(null);
          }}
          onDeleted={handleCarDeleted}
        />
      )}

      {editor && (
        <CarEditor
          mode={editor.mode}
          car={editor.mode === 'edit' ? editor.car : undefined}
          onClose={() => {
            setEditor(null);
          }}
          onSaved={list.refetch}
        />
      )}
      {tasksCar && (
        <PreparationDialog
          key={tasksCar.id}
          carId={tasksCar.id}
          carName={`${tasksCar.brand} ${tasksCar.model}`}
          onClose={() => {
            setTasksCar(null);
          }}
          onChanged={list.refetch}
        />
      )}
    </div>
  );
}
