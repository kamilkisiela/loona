---
title: Angular - Loona client
sidebar_label: Loona client
---

<AUTOGENERATED_TABLE_OF_CONTENTS>

---

## Reference

### `query()`

Fetches and observes data and it's probably your mostly used method of Loona. It works the same as [`Apollo.watchQuery()`](https://www.apollographql.com/docs/angular/basics/queries.html) method

```typescript
import {Loona} from '@loona/angular';

@Component({...})
class AppComponent {
  books: Observable<Book[]>;

  constructor(private loona: Loona) {}

  ngOnInit() {
    this.books = this.loona.query({
      query: gql` { books } `
    })
      .valueChanges
      .pipe(
        map(({data}) => data && data.books)
      );
  }
}
```

To make it even simpler you can pass a query directly as a first argument.

```typescript
import {Loona} from '@loona/angular';

@Component({...})
class AppComponent {
 books: Observable<Book[]>;

 constructor(private loona: Loona) {}

 ngOnInit() {
   this.books = this.loona.query(gql` { books } `)
     .valueChanges
     .pipe(
       pluck('data', 'books')
       // pluck works the same as
       // map(result => result.data && result.data.books)
     );
 }
}
```

Using a second, simpler API, you should know that an object with variables is accepted as the second argument and others options as the last one (`loona.query(query, variables, options)`).

```typescript
@Component({...})
class AppComponent {
  // ...
  ngOnInit() {
    this.books = this.loona.query(query, {
      first: 10
    }, {
      fetchPolicy: 'network-only'
    })
      .valueChanges
      .pipe(
        pluck('data', 'books')
      );
  }
}
```

### `mutate()`

Mutates data and works the same as [`Apollo.mutate()`](https://www.apollographql.com/docs/angular/basics/mutations.html) method. It allows to have much quicker API, just like in `Loona.query` you can pass options normally, as one object or spread mutation, variables and options into three arguments.

```typescript
import {Loona} from '@loona/angular';

const addBookMutation = gql`
  mutation AddBook($text: String) {
    addBook(text: $text)
  }
`;

@Component({...})
class AppComponent {
  constructor(private loona: Loona) {}

  addBook(text: string) {
    // all options in one object
    this.loona.mutate({
      mutation: addBookMutation,
      variables: { text }
    }).subscribe();

    // or just simpler
    this.loona.mutate(addBookMutation, { text }).subscribe();
  }
}
```

### `dispatch()`

Allows to dispatch an action. Works the same as a `dispatch` method in redux or ngrx.

```typescript
import {Loona} from '@loona/angular';

@Component({...})
class AppComponent {
  constructor(private loona: Loona) {}

  addBook(text: string) {
    this.loona.dispatch({
      type: 'ADD_BOOK',
      text
    });
  }
}
```

Since everything can be an action, even a mutation, let's see how it would fit:

```typescript
import {Loona} from '@loona/angular';

class AddBook {
  static mutation = gql`
    mutation AddBook($text: String!) {
      addBook(text: $text)
    }
  `;

  variables: {
    text: string;
  };

  constructor(text: string) {
    this.variables = { text };
  }
}

@Component({...})
class AppComponent {
  constructor(private loona: Loona) {}

  addBook(text: string) {
    this.loona.dispatch(new AddBook(text));
  }
}
```
