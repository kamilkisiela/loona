---
title: React - Migrate from Redux
sidebar_label: Migrate from Redux
---

We don't have yet a solid migration path to switch from Redux or NGRX to Loona but let's explore how it might look like!

Redux-like libraries and Loona have a lot in common. They have something that triggers a change and something that saves that change. Actions and Reducers are conceptually the same as mutations and cache writes.

The one, main difference between Loona and others is the implementation. In Redux or NGRX you have reducers, pure functions that receive a state and modify it by returning an immutable object. Loona does that too. It allows to read the state, make a change and save an immutable object.

So why don't you see Reducers in Loona? They are hidden within Mutations and Updates. Basically, every cache write is something like a reducer.

## Two possible strategies

To migrate a reducer you can do two things:

- keeping the action as is and using an `effect` to mutate the state
- changing an action to a mutation and using `mutation` or `update` to modify the state

### Effect mutate the state

The first strategy is really something you don't want to have at the end but it might help to move you to Loona very quickly.

Because we keep actions the same, let's dive into reducers.

```typescript
// our redux reducer
export function addBook(action, state) {
  return {
    ...state,
    books: [...state.books, action.book],
  };
}

// an effect in Loona
@state()
export class BooksState {
  @effect('addBook')
  bookAdded(action, context) {
    context.patchQuery(
      gql`
        {
          books
        }
      `,
      state => {
        state.books.push(action.book);
      },
    );
  }
}
```

### Actions become Mutations

The first something we want to have at the end.

Because we change actions to mutations and put reducers in them, let's see how it might look like:

```typescript
// our redux reducer
export function addBook(action, state) {
  return {
    ...state,
    books: [...state.books, action.book],
  };
}

// In Loona
@state()
export class BooksState {
  @mutation(AddBook)
  addBook(args, context) {
    context.patchQuery(
      gql`
        {
          books
        }
      `,
      state => {
        state.books.push(args.book);
      },
    );
  }
}
```
