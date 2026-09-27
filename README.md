# State Management Comparison

One CRUD feature (a filterable, sortable, paginated table of cars with create/edit/delete) implemented eight times — once per state manager — behind a shared UI and a shared hook contract. The point isn't to rank the libraries; it's to show that a page's architecture doesn't depend on which one you pick, as long as it follows three rules: **isolated stores**, **low coupling between features**, and **dynamic creation/deletion of models** tied to a component's lifecycle.

This repo is the demo project for an article on why architecture matters more than picking a state manager in React (Habr, in Russian — link added here once published).

- **Live demo:** https://tables-frontend.onrender.com/
- **Backend API:** https://tables-backend-zpsi.onrender.com/api

## How it's built

It's a monorepo: a NestJS + Prisma + Postgres backend serving a simple `Car` CRUD API, and a React + Vite frontend with one route/tab per state manager.

Every tab's `ui/CarsPage.tsx` is nearly line-for-line identical — same shared `CarsTable`, `CarsFilters`, `CarsPagination`, `CarFormModal` components, same hook names (`useCarsQueryState`, `useCars`, `useCreateCar`, `useUpdateCar`, `useDeleteCar`). The state manager's business logic lives entirely behind those hooks, never leaking into the page. The only two library-specific lines in any page are: MobX pages are wrapped in `observer()`, and the React Query page's `refetch()` call is prefixed with `void` (it returns a promise; the others don't). Everything else — filtering, sorting, pagination, CRUD, loading/error states — behaves identically no matter which tab you're on.

### State managers covered

| Folder         | Library                                             | Dynamic variant                    |
| -------------- | --------------------------------------------------- | ---------------------------------- |
| `effector/`    | [Effector](https://effector.dev/)                   | `effector-dynamic-models/`         |
| `zustand/`     | [Zustand](https://zustand.docs.pmnd.rs/)            | `zustand-dynamic-models/`          |
| `mobx/`        | [MobX](https://mobx.js.org/)                        | `mobx-dynamic-models/`             |
| `react-query/` | [TanStack React Query](https://tanstack.com/query/) | — (query state is local by design) |
| `rxjs/`        | [RxJS](https://rxjs.dev/)                           | `rxjs-dynamic-models/`             |
| `reatom/`      | [Reatom](https://www.reatom.dev/)                   | `reatom-dynamic-models/`           |
| `xstate/`      | [XState](https://stately.ai/docs/xstate)            | `xstate-dynamic-models/`           |
| `jotai/`       | [Jotai](https://jotai.org/)                         | `jotai-dynamic-models/`            |

"Static" tabs create their models once, at module scope — the conventional way most of these libraries are used. "Dynamic" tabs create an isolated model per component instance (usually via `useMemo`/`useState`) and tear it down on unmount, so several instances of the same table never share state and don't leak memory when unmounted.

Two extra tabs go a step further, showing composition, not just isolation:

- **`effector-page-model/`** and **`mobx-page-model/`** — four independent, single-responsibility models (filters, sort, pagination, list) are composed into one page model by a wrapper factory/class that creates all four and exposes wrapper methods (e.g. `setFilters` also resets the page). None of the four models know about each other or about the wrapper; only the wrapper knows about them. The instantiated model itself is never exported — only a hook (`useCarsPageModel`) is, so nothing outside the file can reach the raw store/units directly.
- **`empty/`** — a blank tab used purely as a "no-op" baseline when manually testing for memory leaks (switch away from a dynamic-models tab to this one, force GC, and check that the previous tab's models were actually collected).

### Shared layer (`frontend/src/shared/`)

The part every tab reuses unchanged:

- `entities/car/` — the `Car` type, `CarsQueryParams`, API request/response shapes.
- `features/*` — API calls (`filter-cars`, `sort-cars`, `paginate-cars`, `create-car`, `update-car`, `delete-car`) shared by every state manager's model layer.
- `ui/CarsTable.tsx` — the table itself: purely presentational, takes data and callbacks as props, never imports a hook from any state-manager folder.
- `hooks/useDebouncedValue.ts` — debounces filter inputs once, centrally, so fast typing can't cause out-of-order responses to clobber the table in any of the (mostly non-cancelling) state managers.

## Backend

NestJS + Prisma + PostgreSQL, one resource: `Car`.

```
GET    /api/cars       list (paginated, filterable, sortable) → { data: Car[], meta: { page, pageSize, total, totalPages } }
GET    /api/cars/:id   one car
POST   /api/cars       create
PATCH  /api/cars/:id   partial update
DELETE /api/cars/:id   delete (204 No Content)
```

`GET /api/cars` query params: `page`, `pageSize` (max 100), `sortBy` (`price` | `year` | `mileage` | `createdAt` | `brand`), `order` (`asc` | `desc`), plus filters: `brand`, `bodyType`, `color`, `minYear`, `maxYear`, `minPrice`, `maxPrice`, `search`.

CORS origins are read from `CORS_ORIGINS` (comma-separated). Validation is strict (`whitelist: true, forbidNonWhitelisted: true`) — a request body with unknown fields is rejected.

## Running locally

Requires Node.js and a local Postgres instance (or a Neon/any Postgres connection string).

```bash
# backend
cd backend
cp .env.example .env   # fill in DATABASE_URL / DIRECT_URL, or point at local Postgres
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev       # http://localhost:3000/api

# frontend (separate terminal)
cd frontend
cp .env.example .env.local   # VITE_API_BASE_URL, defaults to http://localhost:3000/api
npm install
npm run dev              # http://localhost:5173
```

## Related

The architectural reasoning behind this repo — why isolation, low coupling and dynamic model lifecycles matter more than the library choice, with the experiments (e.g. a `FinalizationRegistry`-based garbage-collection check for Effector's dynamic models) written up in full — is in the article this repo was built for.
