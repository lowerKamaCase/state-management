import { useAtom } from '@reatom/npm-react';
import { DEFAULT_PAGE } from '../../../../shared/entities/car/model/types';
import type { PaginateCarsContract } from '../../../../shared/features/paginate-cars/model/contract';

export function usePaginateCars() {
  const [page, setPage] = useAtom(DEFAULT_PAGE, []);
  return {
    page: page.page,
    pageSize: page.pageSize,
    setPage: (nextPage: number) => {
      setPage((s) => {
        return { ...s, page: nextPage };
      });
    },
    setPageSize: (pageSize: number) => {
      setPage((s) => {
        return { ...s, pageSize };
      });
    },
  };
}

const _typecheck: PaginateCarsContract = { usePaginateCars };
void _typecheck;
