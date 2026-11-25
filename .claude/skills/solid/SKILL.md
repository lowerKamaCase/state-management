---
name: solid
description: Apply the SOLID Interface Segregation Principle when designing or reviewing React component props, especially when a component receives a state model or a hook's return value. Keep props limited to the data and callbacks the component uses.
---

# SOLID: Interface Segregation for component props

A component receives only the data and callbacks it actually uses, rather than a whole model. Passing an entire model (the object a model hook returns) into a component couples that component to everything the model exposes. The model's type becomes part of the props contract, state-manager types can leak into it, and the component becomes harder to render, reuse, or put in a story without that exact model.

```tsx
// ⛔ The table depends on the whole page model: filters, sort, pagination,
// side panels, and every type parameter the model carries.
type CarsTableProps = { model: ReturnType<typeof useCarsPageModel> };

// ✅ The table receives only what it renders or calls.
type CarsTableProps = {
  rows: Car[];
  loading: boolean;
  sort?: SortParam[];
  onSortChange?: (sort: SortParam[]) => void;
};

// The model stays in the component that owns it; that component picks the fields.
function CarsPage() {
  const model = useCarsPageModel();
  return (
    <CarsTable
      rows={model.rows}
      loading={model.isLoading}
      sort={model.sort}
      onSortChange={model.setSort}
    />
  );
}
```

Keep the contract cohesive, not fragmented: things that are always used together (a value and its setter, like `sort` + `onSortChange`) stay together. There is no need for a separate props type per field. The goal is "nothing the component doesn't use", not "as many tiny interfaces as possible".

When reviewing, look for a prop typed as a model or a hook's return value (`ReturnType<typeof useX>`, `SomethingModel`), a component that reads only a small fraction of an object it receives, or a type parameter that exists only because the passed model needs it. Pass the fields and callbacks the component uses; keep the model in the component that owns it.
