# React Query + FSD

This tab uses the same car CRUD, filters, sorting, and pagination as the original React Query tab. It also shows each car's preparation progress and opens its tasks in a modal.

## Dependency direction

`pages → widgets → features → entities → shared`. Imports between slices on the same layer are avoided. Each slice exposes a narrow `index.ts` public API; the page imports widgets only through those APIs.

- `entities/car` owns car types, the list request and query hook, and `useCarsListParams` for reusable car-list filters, sorting, and pagination.
- `entities/preparation-task` owns task types, the list request, and the task query hook.
- Each `features/*` slice owns its mutation request and hook. Mutation hooks do not import other models or invalidate another entity's cache.
- Mutation hooks receive callbacks as an options object, for example `useAddPreparationTask({ onSuccess })`. The caller composes the callback; the hook runs it after a successful mutation.
- `features/delete-car` also owns its confirmation dialog; the mutation error is displayed there. The page receives only the successful deletion callback and refreshes its list.
- `widgets/car-catalog` renders filters, table, and pagination. It receives data and callbacks through props.
- `widgets/car-editor` composes create and update hooks with the form.
- `widgets/preparation-dialog` composes task query and mutation hooks inside the mounted modal.
- `pages/cars` wires widgets together. After a task changes, the modal calls `onChanged`; the page uses that callback to refresh the car list. Neither task model imports the car model nor car model imports the task model.

The car-list parameters are created when their owning page mounts; filter, sort, and page-size changes reset pagination inside the entity hook. Modal selection and mutation hooks also belong to mounted components. TanStack Query retains server data by query key and evicts unused queries according to its cache policy. No application model or store is exported as a singleton.
