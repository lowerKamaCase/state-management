import { createEffect, createEvent, createStore, sample } from 'effector';
import { useUnit } from 'effector-react';
import { useEffect, useMemo } from 'react';
import { getCars } from '../../../../shared/entities/car/api/carsApi';
import type { CarsListContract } from '../../../../shared/entities/car/model/contract';
import type {
  Car,
  CarsQueryParams,
  PaginatedMeta,
} from '../../../../shared/entities/car/model/types';

/**
 * Unlike the static variant (module-level singleton units, created once
 * when the module first loads and shared by every mount of this hook),
 * this factory is called fresh per component instance via useMemo — each
 * mount gets its own isolated graph of units, so two CarsList consumers on
 * the same page never share state. effector doesn't care where a unit was
 * created; useUnit subscribes to whatever store/event reference it's given.
 */
// TEMP LEAK PROBE — not for commit. Registers each individual effector
// unit (event/store/effect — not just the wrapper object returned to the
// caller) in a FinalizationRegistry, so we can tell whether the *actual*
// reactive-graph nodes get garbage-collected, as opposed to merely the
// plain object grouping them. If effector's kernel kept some internal
// registry referencing units directly, the wrapper could die while the
// units themselves lived on forever — this would miss that case, whereas
// tracking every unit closes that gap. A plain-object control with the
// same useMemo lifetime is also tracked, to prove the harness itself
// (fiber teardown + GC + FinalizationRegistry) reliably reclaims things.
declare global {
  interface Window {
    __leakProbe?: {
      unitCreated: number;
      unitFinalized: number;
      byLabel: Record<string, { created: number; finalized: number }>;
      controlCreated: number;
      controlFinalized: number;
    };
  }
}

function getLeakProbe() {
  window.__leakProbe ??= {
    unitCreated: 0,
    unitFinalized: 0,
    byLabel: {},
    controlCreated: 0,
    controlFinalized: 0,
  };
  return window.__leakProbe;
}

const unitRegistry = new FinalizationRegistry<string>((label) => {
  const probe = getLeakProbe();
  probe.unitFinalized++;
  const kind = label.split('#')[0];
  (probe.byLabel[kind] ??= { created: 0, finalized: 0 }).finalized++;
  console.log(`[leak-probe] unit ${label} finalized`);
});

function registerUnit(unit: object, kind: string) {
  const probe = getLeakProbe();
  probe.unitCreated++;
  (probe.byLabel[kind] ??= { created: 0, finalized: 0 }).created++;
  const label = `${kind}#${probe.unitCreated}`;
  unitRegistry.register(unit, label);
  console.log(`[leak-probe] unit ${label} created`);
}

const controlRegistry = new FinalizationRegistry<number>((id) => {
  getLeakProbe().controlFinalized++;
  console.log(`[leak-probe] control object #${id} finalized`);
});

function createCarsListModel() {
  const paramsChanged = createEvent<CarsQueryParams>();
  registerUnit(paramsChanged, 'paramsChanged');
  const refreshRequested = createEvent();
  registerUnit(refreshRequested, 'refreshRequested');

  const $params = createStore<CarsQueryParams | null>(null).on(
    paramsChanged,
    (_, params) => {
      return params;
    },
  );
  registerUnit($params, '$params');

  const fetchCarsFx = createEffect(getCars);
  registerUnit(fetchCarsFx, 'fetchCarsFx');

  sample({
    clock: [paramsChanged, refreshRequested],
    source: $params,
    filter: (params): params is CarsQueryParams => {
      return params !== null;
    },
    target: fetchCarsFx,
  });

  const $cars = createStore<Car[]>([]).on(fetchCarsFx.doneData, (_, res) => {
    return res.data;
  });
  registerUnit($cars, '$cars');
  const $meta = createStore<PaginatedMeta | null>(null).on(
    fetchCarsFx.doneData,
    (_, res) => {
      return res.meta;
    },
  );
  registerUnit($meta, '$meta');
  const $isLoading = fetchCarsFx.pending;
  registerUnit($isLoading, '$isLoading');
  const $listError = createStore<string | null>(null)
    .on(fetchCarsFx.failData, (_, e) => {
      return e.message;
    })
    .on(fetchCarsFx.done, () => {
      return null;
    });
  registerUnit($listError, '$listError');

  return {
    paramsChanged,
    refreshRequested,
    $cars,
    $meta,
    $isLoading,
    $listError,
  };
}

export function useCarsList(params: CarsQueryParams) {
  const model = useMemo(() => {
    return createCarsListModel();
  }, []);

  // Same useMemo lifetime as `model` above (created on mount, held until
  // unmount), but a plain object with zero effector wiring — proves the
  // harness itself (fiber teardown + GC + FinalizationRegistry, in this
  // exact browser/headless setup) actually reclaims objects that live as
  // long as `model` does, when nothing external retains them.
  useMemo(() => {
    const control = { tag: 'control' };
    const probe = getLeakProbe();
    probe.controlCreated++;
    controlRegistry.register(control, probe.controlCreated);
    return control;
  }, []);

  const [cars, meta, isLoading, error] = useUnit([
    model.$cars,
    model.$meta,
    model.$isLoading,
    model.$listError,
  ]);
  useEffect(() => {
    model.paramsChanged(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);
  return {
    cars,
    meta: meta ?? undefined,
    isLoading,
    isFetching: isLoading,
    error,
    refetch: () => {
      model.refreshRequested();
    },
  };
}

const _typecheck: CarsListContract = { useCarsList };
void _typecheck;
