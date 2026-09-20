import { atom, useAtomValue, useSetAtom } from 'jotai';
import { DEFAULT_PAGE } from '../../../../shared/entities/car/model/types';
import type { PaginateCarsContract } from '../../../../shared/features/paginate-cars/model/contract';

const pageAtom = atom(DEFAULT_PAGE.page);
const pageSizeAtom = atom(DEFAULT_PAGE.pageSize);

export function usePaginateCars() {
  const page = useAtomValue(pageAtom);
  const pageSize = useAtomValue(pageSizeAtom);
  const setPage = useSetAtom(pageAtom);
  const setPageSize = useSetAtom(pageSizeAtom);
  return { page, pageSize, setPage, setPageSize };
}

const _typecheck: PaginateCarsContract = { usePaginateCars };
void _typecheck;
