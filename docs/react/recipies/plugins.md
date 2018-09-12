---
title: React - Plugins
sidebar_label: Plugins
---

Loona doesn't have any plugins yet or a proper API for them but that's something we're going to work on soon. We're working on implementing the router plugin.

But there's a way to create those even at this point. Loona provides a way to listen to every dispatched action and a mutation so it's possible to create a simple plugin.

All you need is to access the `Actions` service which is an `Observable`:

```typescript
import {Actions} from '@loona/react';

export class AppModule {
  constructor(actions: Actions, loona: Loona) {
    actions.subscribe(action => {
      //
    });
  }
}
```

## List of plugins

_Work in progress_

---

> If you want your plugin to be listed here, please edit this page and submit a PR.
