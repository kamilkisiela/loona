---
title: Angular - Lazy Loading
sidebar_label: Lazy Loading
---

With all that code splitting and lazy loading modules it's also Loona's responsibility to follow theses patterns.

Loona allows to lazy load subsets of application's state. The api is straightforward:

```typescript
@NgModule({
  imports: [
    LoonaModule.forChild([NotesState])
  ]
})
```

`LoonaModule.forChild()` accepts the same states as `forRoot()` and works pretty much in the same way which means while state is lazy loaded its defaults are being written to the store.

Because we have one store for the whole application, the lazy loaded state is available throughout entire app.
