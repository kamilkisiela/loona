---
title: Error Handling
---

Because it's Angular, we decided to use its `ErrorHandler` so every time an action throws an error it reaches the Angular's error handler.

```typescript
import {ErrorHandler} from '@angular/core';
import {Loona} from '@loona/angular';

@Injectable()
export class OhNoHandler implements ErrorHandler {
  constructor(private loona: Loona) {}

  handleError(error: any) {
    if (ifSomethingWeWantToCatch(error)) {
      this.loona.dispatch(new OhNo(error));

      // you decide to rethrow an error or not
      return;
    }
    throw error;
  }
}
```

You still need to replace the original ErrorHandler with your custom one:

```typescript
@NgModule({
  // ...
  providers: [
    {
      provide: ErrorHandler,
      useClass: OhNoHandler,
    },
  ],
})
export class AppModule {}
```

To catch a failed mutation you need to use Loona's `Actions` service that emits every action that happened, or mutation:

```typescript
import {Actions} from '@loona/angular';

export class AppModule {
  constructor(actions: Actions) {
    actions.subscribe(mutation => {
      if (mutation.ok === false) {
        console.error(mutation.error);
      }
    });
  }
}
```
