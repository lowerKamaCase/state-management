import { atom, createStore, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { DEFAULT_PAGE } from '../../../../shared/entities/car/model/types';
import type { PaginateCarsContract } from '../../../../shared/features/paginate-cars/model/contract';

function createPaginateCarsModel() {
  const store = createStore();
  const pageAtom = atom(DEFAULT_PAGE.page);
  const pageSizeAtom = atom(DEFAULT_PAGE.pageSize);
  return { store, pageAtom, pageSizeAtom };
}

export function usePaginateCars() {
  const [model] = useState(() => {
    return createPaginateCarsModel();
  });
  const { store } = model;
  const page = useAtomValue(model.pageAtom, { store });
  const pageSize = useAtomValue(model.pageSizeAtom, { store });
  const setPage = useSetAtom(model.pageAtom, { store });
  const setPageSize = useSetAtom(model.pageSizeAtom, { store });
  return { page, pageSize, setPage, setPageSize };
}

const _typecheck: PaginateCarsContract = { usePaginateCars };
void _typecheck;
