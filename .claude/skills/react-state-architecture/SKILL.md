---
name: react-state-architecture
description: Applies three architecture rules for React apps that use a state manager (Effector, Zustand, MobX, Redux/RTK, Jotai, XState, Reatom, RxJS-based stores, or TanStack React Query) so the choice of library stops being the thing that determines whether the codebase stays maintainable — isolated stores, low coupling between features (cross-feature wiring only through components/hooks, never direct store-to-store imports, models export only hooks), and model lifecycles tied to the component that owns them instead of defaulting to global singletons. Use this automatically whenever writing, reviewing, or refactoring any store/model/atom/slice file, whenever wiring one feature's data to another feature's UI (classic case: "refresh table X after action Y succeeds", "open a modal that needs data from another store"), and whenever deciding if a store should be global/static or scoped to a component. Also trigger on questions about state management architecture, coupling, "god store" / "god object", memory leaks in global stores, or how to structure a new feature's data layer — even if no specific library is named.
---

# React state management architecture

These three rules came out of building the same CRUD feature eight times, once per state manager (Effector, Zustand, MobX, TanStack React Query, RxJS, Reatom, XState, Jotai), and comparing what broke down as the app grew. The library never mattered much. What mattered was whether these three rules were followed. Apply them regardless of which state manager the project uses — translate the mechanics (how you create/destroy a store, how you call it) but never skip the rule itself.

## Rule 1 — Isolation: one store, one entity

A store represents one domain entity (a car, a user, a cart), not "the app". The opposite is a God object / God store — one place that holds all of an app's data (classic Redux-without-slices, or RTK's `configureStore({ reducer: {...} })`, which still produces one store and one state tree under the slices).

When writing a new store: name it after the entity it owns, and resist the urge to add "just one more field" that belongs to a different entity. When reviewing one: if the store's name doesn't describe a single responsibility, or it's accumulating unrelated fields, split it.

## Rule 2 — Low coupling: composition belongs to components, not to models

**Never import one store/model file into another store/model file.** This is the rule most worth enforcing, because it's the one that silently rots a codebase: every direct store→store import adds a hidden edge to a dependency graph nobody is looking at, and it compounds.

When one feature's action needs to affect another feature's data (a table that must refresh after an import button succeeds, a modal whose data depends on another store), the connection is made **in a component**, via props — a small, explicit contract — never by one model reaching into another.

```tsx
// The contract: a plain props type, no state-manager types leak into it.
type ImportButtonProps = {
  onSuccess: () => void;
  params: Record<string, string>;
};

// The wiring lives in the component that knows about both features.
// ImportButton and the table never know about each other.
function OrdersTableWidget() {
  const { refetch } = useTableData();
  const params = useImportParams();
  return (
    <Table
      headerButtons={[<ImportButton onSuccess={refetch} params={params} />]}
    />
  );
}
```

**A model file exports only hooks — never the raw store, unit, atom, signal, or class instance.** Create the state inside the file (module scope for a static model, or inside the hook via `useMemo`/`useState` for a dynamic one), expose it only through a hook, and never export the thing itself.

```ts
// store.ts — the pattern for every state manager in this list
const $filters = createStore(defaultFilters); // or: atom(), create(), makeAutoObservable instance, etc.
// ⛔ export { $filters }        — never do this
// ✅ export function useFilters() { return useUnit($filters); }
```

Why this specific rule earns its keep: React requires every hook to be called synchronously during render (Rules of Hooks). That means any composition built from hooks is always reachable by "go to definition" (Ctrl+Click / F12) starting from a rendered component — open the component, jump to the hook, see what it pulls in. A tangle of hooks is a _discoverable_ problem. A tangle of models importing each other directly is an _invisible_ one — it lives in a parallel import graph that nobody walks until something breaks and someone goes hunting file by file. Exporting only hooks doesn't make bad composition impossible; it makes it visible from the component tree instead of hidden in the model layer. (This traceability benefit does erode if a composition hook gets extracted somewhere generic and reused everywhere — but the structural rule still holds.)

When reviewing existing code, the tell is a store/model file with an `import` pointing at another model's internals (a store, a unit, a class instance, an atom) rather than at its hook.

## Rule 3 — Dynamic lifecycle: scope models to the component that needs them

Default to creating a model when the component that owns it mounts, and destroying it when that component unmounts — not to declaring it once at module scope as a permanent global. Reach for a genuinely global/static store only when the data must outlive any single component (auth session, feature flags, something intentionally app-wide) — that should be a deliberate choice, not the default just because most library examples online are written that way.

The anti-pattern to watch for is a global key-value store where entries pile up under a key (`cache[id] = ...`) and nothing ever removes them — it's a cache with no eviction policy, which is a memory leak with extra steps. (TanStack Query's own cache is the counter-example done right: entries are keyed the same way, but `gcTime` actually evicts unused ones after their last consumer unsubscribes.)

Mechanically, "dynamic" means: a factory function (or class) creates the model, the component calls it once via `useMemo`/`useState` on mount, and the reference is dropped on unmount so garbage collection can reclaim it. Per-library specifics:

- **Effector**: factory creates events/stores/effects/`sample` wiring; call it inside `useMemo`. (Effector's own docs recommend static, module-scope creation for leak-safety — in practice, a fully self-contained factory with no `sample` link to a long-lived static unit collects fine without `clearNode`; don't assume a link into static units behaves the same.)
- **Zustand**: a vanilla `createStore()` per instance (their documented pattern for scoping to a component), or `useState(() => create(...))`.
- **MobX**: `new SomeStore()` inside `useState`/`useLocalObservable`; wrap the consuming component in `observer()` or it won't re-render.
- **Jotai**: a per-instance `createStore()` + `<Provider store={...}>`, with atoms created inside `useState` rather than at module scope, so instances don't share atoms.
- **XState / Reatom / RxJS-based stores**: same shape — factory in `useMemo`, torn down on unmount.
- **Redux / RTK**: not built for this. `combineSlices` + `inject` can add a slice after store creation, but there's no supported slice removal — don't reach for Redux when a model's lifetime should match a component's.
- **TanStack React Query**: usually needs none of this — `useQuery`/`useMutation` already scope server state to the call site via `queryKey`; reach for a client-side store only once you need client state react-query doesn't model.

## Advanced: composing several models that belong to the SAME feature

Rule 2 says "don't let models import each other." That is not a ban on ever combining models — it's a ban on combining models from _different, independently-existing_ features outside a component. Pieces of **one** feature are a different case.

Example: a table's filters, sort, pagination, and list are four single-responsibility models (each independently fine per Rule 1), but they're always used together, on one screen, and some operations need to touch more than one (changing a filter should reset the page). Compose them with a wrapper — a factory/class that creates all four, exposes wrapper methods (`setFilters` updates the filter model, then resets pagination), and whose own instance is **never exported, only a hook**:

```ts
// cars-page-store.ts
class CarsPageStore {
  readonly filterStore = new FilterCarsStore();
  readonly sortStore = new SortCarsStore();
  readonly paginateStore = new PaginateCarsStore();
  readonly listStore = new CarsListStore();

  setFilters(patch: FiltersPatch) {
    this.filterStore.setFilters(patch);
    this.paginateStore.setPage(1); // the one place that's allowed to know both exist
  }
}
// the instance stays private to this file:
const store = new CarsPageStore();
export function useCarsPageModel() {
  /* ... */
}
```

None of the four sibling models know about each other or about the wrapper; only the wrapper knows about them, and only in one direction (wrapper → siblings, never back). This is Rule 2 applied one level up, not an exception to it — the four pieces are one feature's internals, not four features.

The boundary: if someone later adds an unrelated, independently-useful feature (e.g. a "create car" model that could exist without this table) into the same wrapper, that crosses back into the violation Rule 2 forbids. That composition belongs in a component instead, the same way `OrdersTableWidget` above wires `ImportButton` to the table — not inside a class that reaches across features on its own.

Constructing the wrapper's siblings with plain `new` (not passed in as constructor parameters) is fine here, not a dependency-injection smell — DI exists to let you swap an implementation (for tests, for a different environment); each sibling here has exactly one real implementation, so there's nothing to swap, and adding a parameterized constructor "to be safe" is pure overengineering for this case.

## Self-check when writing or reviewing code

- Does a store/model file `import` another store/model file's internals (its store, unit, atom, class instance)? → That wiring belongs in a component instead, via props.
- Does a model file export anything other than a hook? → Wrap it; export only the hook.
- Is a new store declared once at module scope (global by default), with nothing tying its lifetime to a component? → Confirm that's intentional (truly app-wide data); otherwise scope it to the component that needs it.
- When composing several models into one hook: are all of them genuinely pieces of **one** feature/screen that are always used together? → If an unrelated, independently-existing feature is being pulled in, pull that wiring back out into a component.
