---
title: React - Mutation as Action
sidebar_label: Mutation as Action
---

It's not only an action that can be dispatched, you can do it too with a mutation. If you don't need the result of a mutatiin and you want to access data only through your queries, dispatching an action makes a lot of sense in this case.

## How to define

Mutations are dispatched pretty much the same way as actions. You first need to define one:

```typescript
export class AddBook {
  static mutation = gql`
    mutation AddNewBook($title: String!) {
      addBook(title: $title) @client {
        id
        title
      }
    }
  `;

  variables: {title: string};

  constructor(title: string) {
    this.variables = {
      title,
    };
  }
}
```

Okay, now we've got a class called `AddBook` that is a mutation and looks like an action but instead of `type` property is has `mutation` and `variables`.

## How to dispatch

To dispatch the `AddBook` in a component you simple follow the same steps like with a regular action:

```typescript
import {connect} from '@loona/react';

export default connect(dispatch => ({
  addBook: title => dispatch(new AddBook(title)),
}));
```

## Use with Effects

Since we used mutation as an action it means we can use Effects on it too

```typescript
@State()
class BooksState {
  @Effect(AddBook)
  bookAdded(action, context) {
    console.log('New Book!');
  }
}
```

### Shape

When a mutation is dispatched `Apollo.mutate()` is called under the hood. After mutation resolves Loona runs effects and the action object they get has a different structure then mutation itself.

Instead of receiving an object with _mutation_ and _variables_ properties it uses the same shape like other actions have. The `type` property says it's a `mutation`.

```
{
  type: 'mutation';
  options: MutationOptions;
  ok: boolean;
  // ...
}
```

- **type** - always equals `mutation`.
- **options** - the same object that Loona.mutate() accepts so it contains: _mutation_, _variables_ and options like _fetchPolicy_ and others.
- **ok** - it's `true` if mutation was succesfull, or `false` otherwise

### Status

Base on the `ok` property you can tell if the mutation resolved or errored.

Besides those three options Loona emits a different shape depending if mutation resolved or not.

If mutation was succesfull:

```
{
  type: 'mutation',
  options:  { mutation: ..., variables: ... },
  ok: true,
  data: ...
}
```

but on failure:

```
{
  type: 'mutation',
  options:  { mutation: ..., variables: ... },
  ok: false,
  error: ...
}
```

Now with all that knowledge we can react depending on the status of an action:

```typescript
@State()
class BooksState {
  @Effect(AddBook)
  bookAdded(action, context) {
    const title = action.options.variables.title;

    if (action.ok) {
      console.log(`New the '${title}' added`);
    } else {
      console.error(`Adding '${title}' failed`);
    }
  }
}
```

## Use in resolvers

You define resolvers as you would normally do except instead of passing the name of the mutation you pass a class:

```typescript
import {State, Mutation} from '@loona/react';

@State({...})
export class BooksState {
  @Mutation(AddBook)
  addBook(args, context) {
    // some logic
  }

  @Update(AddBook)
  addToBooks(mutation, context) {
    // some logic
  }
}
```

It's the same with Updates, a class instead of a string.
