---
title: React - Queries
sidebar_label: Queries
---

Queries are a way to fetch remote data from your GraphQL Endpoint, or local data, from Loona.

## Getting started with Queries

In this section we will try to explain how to define and use queries, but if you want to dive deeper, read the ["More advanced explanation"](#more-advanced-explanation) chapter.

### How to define a query

We define everything through State classes:

```typescript
import {state} from '@loona/react';

@state({
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
    books: [],
  },
})
export class BooksState {}
```

As you can tell, the schema allows us to fetch a list of books with their ids and titles.

So how do we actually query data from a component?

### How to query data

Introducing the `Query` component! Yay! If you're familiar with React Apollo, you should catch the idea behind the Query component very quickly. It's the same component!

Let's show everything based on an example. Here's our query. It contains a `@client` directive that tells Loona it's a client side query, and that we want to fetch the local state:

```graphql
query GetAllBooks {
  books @client {
    id
    title
  }
}
```

To use it with Loona, first we need to import the `Query` component and pass our query to it:

```jsx
import {Query} from '@loona/react';
import gql from 'graphql-tag';

const getAllBooks = gql`
  query GetAllBooks {
    books @client {
      id
      title
    }
  }
`;

export const List = () => (
  <Query query={getAllBooks}>
    {({loading, error, data}) => {
      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;

      return (
        <ul>
          {data.books.map(book => (
            <li key={book.id}>{book.title}</li>
          ))}
        </ul>
      );
    }}
  </Query>
);
```

Now the component will render a list of books. It's an empty list at the moment, because we need to learn about [mutations](./mutations) first, but I promise, it works!

> If you want to learn more about how queries works please follow this page, if not jump to [Mutations](./mutations) instead.

---

## More advanced explanation

### What is a query

Since a query is a way for components or services to ask for data, we need to talk about where and how the request is being resolved.

When you make a request, or in other words, a query, you expect to receive something in return. As you're likely already familiar with GraphQL concepts, we will explain Loona queries based on remote data. Typically with GraphQL clients, when you ask for data, the client makes an HTTP request, which hits the GraphQL server, checks which fields you asked for, and gives you exactly what you need in return.

With Loona, when querying for data, although the request doesn't hit a remote server, queries still work similarly as when being used with a GraphQL server. Loona analyzes your query and checks first if the names of the fields you asked for match the state of the store. If so, Loona resolves those fields with the matching data, otherwise it reaches your resolver functions, just as it would on the server.

In case this doesn't seem too clear, let's take the opportunity together to go through an example.

Here's what our example query looks like. We want to fetch a list of books, with their ids and titles.

```graphql
query GetAllBooks {
  books {
    id
    title
  }
}
```

### Query with a default value

We explained to you how Loona resolves data. As you remember, data is resolved directly from a cache or by resolver functions.

Let's first see what _"directly from a cache"_ means.

First, let's define a state and its shape.

```typescript
import {state} from '@loona/react';

@state({
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
    books: [
      {
        id: 1,
        title: 'Harry Potter',
        __typename: 'Book', // <-- required, and should reflect the type name
      },
    ],
  },
})
export class BooksState {}
```

> Why `__typename`? It's a property that Apollo (Loona is based on Apollo) uses internally to match data with a type.
> To learn more about how Apollo's Store works please read the [_How store works?_](../advanced/how-store-works) page.
> It explains in detail what mechanism Apollo uses and how you can take advantage of it in your application.
> We highly recommend to read it! We find it very interesting but we're nerds!

Okay, we have a query field called `books` that returns an array of books, and as you can see, we've also provided an initial book.

Now when you fetch data with the query we defined at the beginning:

```graphql
query GetAllBooks {
  books @client {
    id
    title
  }
}
```

You'll get this result:

```json
{
  "books": [
    {
      "id": 1,
      "title": "Harry Potter"
    }
  ]
}
```

This was possible because Loona saw there was a matching field in the store.

### Query with a resolver

We explained to you how Loona resolves data by looking at a store to match a requested field.
Now let's not provide defaults and use a function to return data.

```typescript
import {state, resolve} from '@loona/react';

@state({
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
export class BooksState {
  @resolve('Query.books')
  books() {
    return [
      {
        id: 1,
        title: 'Harry Potter',
        __typename: 'Book',
      },
    ];
  }
}
```

Okay, we have a resolver function for the `books` field. As you can see it returns an array with the "Harry Potter" book.

Now when you fetch data with the same query as previously:

```graphql
query GetAllBooks {
  books @client {
    id
    title
  }
}
```

You'll get this result:

```json
{
  "books": [
    {
      "id": 1,
      "title": "Harry Potter"
    }
  ]
}
```

### Difference

What is the difference then?

Resolver functions work the same as in your regular GraphQL Server. They resolve some data, and that data is later on saved to the Store. Again, if you don't understand exactly what happend I highly recommend reading the advanced section about it.
