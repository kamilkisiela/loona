---
title: React - Actions
sidebar_label: Actions
---

Think of an Action as a declarative way to call a mutation or to trigger a different action based on some behaviour.

In this section we will try to explain what Actions are and how to use them.

## How to define an Action

First of all, you don't have to define actions, but as your application grows, you'll likely find it useful to have a declarative way to react to state changes, as with other state management libraries. For example, in Redux or NGRX, the part that reacts to an action is a reducer, and actions are created dynamically within components, or defined in advance.

In Loona we highly recommend you follow this pattern:

```typescript
export class AddBook {
  static type = '[Books] Add';

  constructor(public title: string) {}
}
```

## How to call an Action

Just like in any other redux-like library we have the `dispatch` method that triggers an action.

### Using Action component

```jsx
import {Action} from '@loona/react';

const NewBook = () => (
  <Action>
    {dispatch => (
      <button onClick={() => dispatch(new AddBook('Harry Potter'))}>
        Add Harry Potter
      </button>
    )}
  </Action>
);
```

### Using connect HOC

```jsx
import {connect} from '@loona/react';

const NewBookView = ({addBook}) => (
  <button onClick={() => addBook('Harry Potter')}>Add Harry Potter</button>
);

const actions = dispatch => ({
  addBook: title => dispatch(new AddBook(title)),
});

export default connect(actions)(NewBookView);
```

We think it's straightforward so let's jump to the next section.

## How to listen to an Action

In the example above, we dispatched an action, and as the `type` suggests, it should somehow add a new book to the list.

To listen for an action we can make use of a concept called Effects.

```typescript
import {effect} from '@loona/react';

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

> To learn more about Effects please [read the next chapter](./effects).

---

## Mutation as an action?

It's not only an action that can be dispatched. You can do it with a mutation, too.

To fully explore that topic, please go to the [_"Mutation as Action"_](../advanced/mutation-as-action) page.
