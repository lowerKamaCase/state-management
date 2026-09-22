import { combine, createEvent } from 'effector';
import { createCarsListModel } from './create-cars-list-model';
import { createFilterCarsModel } from './create-filter-cars-model';
import { createPaginateCarsModel } from './create-paginate-cars-model';
import { createSortCarsModel } from './create-sort-cars-model';

/**
 * The wrapper factory: calls the four factories above and wires them
 * together. Filters, sort, pagination and the list fetch are not
 * independent features — they are facets of the same "browse the list"
 * concern, split into separate factories only for reuse. Reaching into
 * paginateModel.$page from here, using filterModel/sortModel's own events,
 * is what makes this a wrapper rather than one feature importing another —
 * no individual factory above knows the other three exist.
 */
export function createCarsPageModel() {
  const filterModel = createFilterCarsModel();
  const sortModel = createSortCarsModel();
  const paginateModel = createPaginateCarsModel();

  // Wrapper callback: changing filters or sort always jumps back to page 1.
  paginateModel.$page.on(
    [
      filterModel.filtersChanged,
      sortModel.sortChanged,
      filterModel.filtersReset,
    ],
    (s) => {
      return { ...s, page: 1 };
    },
  );

  const $queryParams = combine(
    filterModel.$filters,
    sortModel.$sort,
    paginateModel.$page,
    (filters, sort, page) => {
      return { ...filters, ...sort, ...page };
    },
  );

  const refreshRequested = createEvent();

  const listModel = createCarsListModel($queryParams, [
    filterModel.filtersChanged,
    filterModel.filtersReset,
    sortModel.sortChanged,
    paginateModel.pageChanged,
    paginateModel.pageSizeChanged,
    refreshRequested,
  ]);

  return {
    filterModel,
    sortModel,
    paginateModel,
    listModel,
    refreshRequested,
  };
}
