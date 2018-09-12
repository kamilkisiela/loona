---
title: Angular - Migrate from NGRX or Redux
sidebar_label: Migrate from NGRX or Redux
---

We don't have yet a solid migration path to switch from Redux or NGRX to Loona but let's explore how it might look like!

Redux-like libraries and Loona have a lot in common. They have something that triggers a change and something that saves that change. Actions and Reducers are conceptually the same as mutations and cache writes.

The one, main difference between Loona and others is the implementation. In Redux or NGRX you have reducers, pure functions that receive a state and modify it by returning an immutable object. Loona does that too. It allows to read the state, make a change and save an immutable object.

So why don't you see Reducers in Loona? They are hidden inside of Mutations and Updates. Basically, every cache write is something like a reducer.

## Two possible strategies

To migrate a reducer you can do two things:

- keeping the action as is and using an `Effect` to mutate the state
- changing an action to a mutation and using `Mutation` or `Update` to modify the state

### Effect mutate the state

The first strategy is really something you want to have at the end but it might help to move you to Loona very quickly.

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
@State()
export class BooksState {
  @Effect('addBook')
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
@State()
export class BooksState {
  @Mutation(AddBook)
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

### Running side by side

While migrating you can have both running side by side. What's more interesting, Loona can expose the state of NGRX or Redux.

```typescript
@State()
export class BooksState {
  constructor(private store: Store) {}

  @Resolve('Query.books')
  books() {
    return this.store.pipe(map(state => state.books));
  }
}
```

Now inside of a component you can query books:

```typescript
const allBooks = gql`
  {
    books @client
  }
`;

@Component({...})
export class ListComponent {
  books: Observable<Book[]>;
  constructor(private loona: Loona) {}

  ngOnInit() {
    this.books = this.loona.query({
      query: allBooks,
      fetchPolicy: 'network-only',
    })
      .valueChanges.pipe(pluck('data', 'books'));
  }
}
```

Important to notice, we specified `fetchPolicy` to `network-only`. It might seem complicated at first. The reason behind it is that Apollo (Loona uses Apollo under the hood) has a default policy set to `cache-first` so it will check if the data is in the cache and it will use it without asking a network for it.

`Network` doesn't mean your GraphQL Server, it means it will ask for data something different than the cache, it might be a GraphQL Server but it also could be your Loona setup.

By using `network-only` you skip the cache and always ask the network, which in our case is Loona!

> To read about other fetch policies please [visit Apollo's documenation](https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-config-options-fetchPolicy).

> To understand how store works [this chapter in our documentation](../advanced/how-store-works).
