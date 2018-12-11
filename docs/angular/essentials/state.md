---
title: Angular - State
sidebar_label: State
---

State is a model that describes a slice of your application's state, with all possible mutations, queries and others. It's important to keep it simple and easy to read.

## Define a State

State is defined by a class with a `State` decorator on top.

Here's how it looks:

```typescript
import {State} from '@loona/angular';

@State({})
export class BooksState {}
```

### Write Schema

To describe the shape and structure of our state, we can define a schema by simply passing it to the `typeDefs` option. It will make everything easier to read and more predictable.

```typescript
import {State} from '@loona/angular';

@State({
  typeDefs: `
    type Book {
      id: ID
      title: String
    }

    type Query {
      books: [Book]
    }
  `,
})
export class BooksState {}
```

It's a regular GraphQL Schema so if you're not familiar with GraphQL, please [read about schema here](http://graphql.github.io/learn/schema/).

With the `Query` type we declared that the state should expose some data via queries. By accessing the `books` query, the user will be able to fetch a list of objects that are defined by a type called `Book` that has an `id` and a `title`.

> It's important to know that defining a schema is not required but we highly recommend to do it. It will help you understand the shape of your data.

### Write defaults

Since we defined a query that resolves a list of books, we might want to provide a default value for it. For simplicity, let's say it should be an empty array. We can achieve this by setting a `defaults` option, like so:

```typescript
import {State} from '@loona/angular';

@State({
  // ...
  defaults: {
    books: []
  }
})
export class BooksState {}
```

Now when you include `books` in your query you will get an empty array in return.

Here's how it looks with the previously defined schema:

```typescript
import {State} from '@loona/angular';

@State({
  typeDefs: `
    type Book {
      id: ID
      title: String
    }

    type Query {
      books: [Book]
    }
  `,
  defaults: {
    books: []
  }
})
export class BooksState {}
```

### Summary

An explanation of what we did:

1. First, we defined a schema to describe the shape and structure of our state
2. Then, we provided a default value of that state
