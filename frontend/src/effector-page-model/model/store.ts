import { useUnit } from 'effector-react';
import { useEffect } from 'react';
import type {
  CarSortField,
  SortOrder,
} from '../../shared/entities/car/model/types';
import { createCarsPageModel } from './create-cars-page-model';

/**
 * createCarsPageModel (and the four factories it composes) are exported —
 * reusable, testable on their own. The result of calling it is not: it
 * stays private to this file, exactly like every other static model in
 * this project only ever exports a hook, never a live store/event.
 */
const pageModel = createCarsPageModel();

export function useCarsPageModel() {
  const [filters, sort, page, cars, meta, isLoading, error] = useUnit([
    pageModel.filterModel.$filters,
    pageModel.sortModel.$sort,
    pageModel.paginateModel.$page,
    pageModel.listModel.$cars,
    pageModel.listModel.$meta,
    pageModel.listModel.$isLoading,
    pageModel.listModel.$listError,
  ]);
  const [setFilters, resetFilters, setSortRaw, setPage, setPageSize, refresh] =
    useUnit([
      pageModel.filterModel.filtersChanged,
      pageModel.filterModel.filtersReset,
      pageModel.sortModel.sortChanged,
      pageModel.paginateModel.pageChanged,
      pageModel.paginateModel.pageSizeChanged,
      pageModel.refreshRequested,
    ]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    filters,
    setFilters,
    resetFilters,
    sortBy: sort.sortBy,
    order: sort.order,
    setSort: (sortBy: CarSortField, order: SortOrder) => {
      setSortRaw({ sortBy, order });
    },
    page: page.page,
    pageSize: page.pageSize,
    setPage,
    setPageSize,
    cars,
    meta: meta ?? undefined,
    isLoading,
    isFetching: isLoading,
    error,
    refetch: refresh,
  };
}
