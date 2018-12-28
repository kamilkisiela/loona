---
title: React - Effects
sidebar_label: Effects
---

Effects define how you react to a dispatched action. This chapter explains in detail what Effects are and how to take advantage of them.

## How to define an effect

In the previous page we looked at Actions and we already created our first Effect.

Let's bring it back:

```typescript
import {effect} from '@loona/react';

export class AddBook {
  static type = '[Books] Add';

  constructor(public title: string) {}
}

@state()
export class BooksState {
  @effect(AddBook)
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

When an action is dispatched, the corresponding effects will be called. Those effects are simple functions with the following arguments:

- `action` - a plain object that always has the `type` property and represents the dispatched action
- `context` - an object with a `dispatch` function and a few helpers (take a look at [the api reference](../api/effect-context))

## Dispatch an action

Effects can also dispatch other actions. Simply use the `dispatch` function provided within `context`.

```typescript
export class BooksState {
  @effect(AddBook)
  bookAdded(action, context) {
    if (action.title.includes('Harry Potter')) {
      context.dispatch({
        type: 'ERROR',
        message: 'Yet another Harry Potter book...',
      });
    }
  }
}
```

## Multiple actions

The `effect` accepts not only a single action class, but also an array of them.

```typescript
export class BooksState {
  constructor(private notifications: NotifictionService) {}

  @effect([AddBook, RemoveBook])
  onBook(action) {
    if (action.type === AddBook.type) {
      this.notifications.notify('Book added:', action.title);
    } else {
      this.notifications.notify('Book removed', action.title);
    }
  }
}
```

> That's all! Effects are the last concept we wanted to explain to you. You're now able to start using Loona in your application.

> If you want to explore more, we recommend to check out other interesting chapters, especially those from the Advanced section.

---

## Effects on mutations?

It's not only an action that you can attach an effect to, you can do it, too, with mutations.

To fully explore that topic, please go to the [_"Mutation as Action"_](../advanced/mutation-as-action) page.
