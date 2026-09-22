import { CarsPageStore } from './cars-page-store';

/**
 * CarsPageStore (and the four stores it composes) are exported — reusable,
 * testable on their own. The instance is not: it stays private to this
 * file, exactly like every other static model in this project only ever
 * exports a hook, never a live store.
 */
const pageStore = new CarsPageStore();

export function useCarsPageModel() {
  return {
    filters: pageStore.filterStore.filters,
    // oxlint-disable-next-line typescript/unbound-method -- autoBind: true (see constructor)
    setFilters: pageStore.setFilters,
    // oxlint-disable-next-line typescript/unbound-method -- autoBind: true (see constructor)
    resetFilters: pageStore.resetFilters,
    sortBy: pageStore.sortStore.sortBy,
    order: pageStore.sortStore.order,
    // oxlint-disable-next-line typescript/unbound-method -- autoBind: true (see constructor)
    setSort: pageStore.setSort,
    page: pageStore.paginateStore.page,
    pageSize: pageStore.paginateStore.pageSize,
    // oxlint-disable-next-line typescript/unbound-method -- autoBind: true (see constructor)
    setPage: pageStore.paginateStore.setPage,
    // oxlint-disable-next-line typescript/unbound-method -- autoBind: true (see constructor)
    setPageSize: pageStore.paginateStore.setPageSize,
    cars: pageStore.listStore.cars,
    meta: pageStore.listStore.meta ?? undefined,
    isLoading: pageStore.listStore.isLoading,
    isFetching: pageStore.listStore.isLoading,
    error: pageStore.listStore.error,
    refetch: () => {
      void pageStore.listStore.fetchCars(pageStore.queryParams);
    },
  };
}
