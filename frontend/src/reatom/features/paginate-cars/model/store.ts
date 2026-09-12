import { atom } from '@reatom/core';
import { useAtom } from '@reatom/npm-react';
import { DEFAULT_PAGE } from '../../../../shared/entities/car/model/types';
import type { PaginateCarsContract } from '../../../../shared/features/paginate-cars/model/contract';

const pageAtom = atom(DEFAULT_PAGE, 'pageAtom');

export function usePaginateCars() {
  const [page, setPageAtom] = useAtom(pageAtom);
  return {
    page: page.page,
    pageSize: page.pageSize,
    setPage: (nextPage: number) => {
      setPageAtom((s) => {
        return { ...s, page: nextPage };
      });
    },
    setPageSize: (pageSize: number) => {
      setPageAtom((s) => {
        return { ...s, pageSize };
      });
    },
  };
}

const _typecheck: PaginateCarsContract = { usePaginateCars };
void _typecheck;
