---
title: Actions
---

Think of an Action as a declarative way to call a mutation or to trigger a different action based on some behaviour.

## Getting started with Actions

In this section we will try to explain what Actions are and how to use them actions.

### How to define an Action

First of all, you don't have to define actions but just like in other state management libraries you want to react to them. For example in Redux or NGRX, the part that reacts to an action is a reducer and actions are created dynamicaly inside of components or defined in advance.

In Loona we highly recommend you to follow this pattern:

```typescript
export class AddBook {
  static type = '[Books] Add';

  constructor(public title: string) {}
}
```

### How to call an Action

Everything spins around the `Loona` service. Just like in any other redux-like libraries we have the `dispatch` method that triggers an action:

```typescript
import {Loona} from '@loona/angular';

@Component({...})
export class NewBookComponent {
  constructor(private loona: Loona) {}

  addBook(title: string) {
    this.loona.dispatch(
      new AddBook(title)
    );
  }
}
```

We think it's straightforward so let's jump to the next section.

### How to listen to an Action

In the example above, we dispatched an action and as the `type` says, it should somehow add a new book to the list.

To listen for an action we have a concept called Effects.

```typescript
import {Effect} from '@loona/angular';

@State()
export class BooksState {
  @Effect(AddBook)
  bookAdded(action, context) {
    console.log(action);
    // outputs:
    // {
    //   type: '[Books] Add',
    //   title: '...'
    // }
  }
}
```

To learn more about Effects please [read the next chapter](./effects).
