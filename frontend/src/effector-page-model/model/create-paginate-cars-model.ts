import { createEvent, createStore } from 'effector';
import { DEFAULT_PAGE } from '../../shared/entities/car/model/types';

export function createPaginateCarsModel() {
  const pageChanged = createEvent<number>();
  const pageSizeChanged = createEvent<number>();

  const $page = createStore(DEFAULT_PAGE)
    .on(pageChanged, (s, page) => {
      return { ...s, page };
    })
    .on(pageSizeChanged, (s, pageSize) => {
      return { ...s, pageSize };
    });

  return { $page, pageChanged, pageSizeChanged };
}
