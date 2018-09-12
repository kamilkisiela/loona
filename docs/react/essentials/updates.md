---
title: React - Updates
sidebar_label: Updates
---

Update allows to modify the data based on a mutation.

## Getting started with Updates

In this section we will try understand why the concept of updates might be helpful in your application.

The whole idea behind Updates is to keep store updates separated from mutations. Sometimes you might want to modify the store not only based on the local side actions but also on remote ones too.

What are the benefits of using Updates?

- you no longer keep the code responsible for store updates inside of your components or services
- it scales easier
- keeps the code clean

### How to define an update

As always, we define everything through State classes. We will use the same class as in the previous chapter:

```typescript
import {State, Update} from '@loona/angular';

@State({
  defaults: {
    books: [],
  },
})
export class BooksState {
  // ... rest of the code

  @Update('addBook')
  addToBooks(mutation, context) {
    // some logic
  }
}
```

A closer look at what we did here:

- a method called `addToBooks` that accepts two arguments, an object (contains a result of the mutation and its variables) and the [context](../api/context).
- the `Update` decorator on top of the method with `addBook` as a value.

By using the decorator we told Loona that we want to call that method every time mutation called `addBook` happens. Under the `mutation` argument we expect to get an object with our newly added book. The second argument is the same context that mutations receive.

### How it works with mutations

Okay but our mutation already does the update. Let's see how it looks right now:

```typescript
export class BooksState {
  @Mutation('addBook')
  addBook(args, context) {
    // our new book
    const book = {
      id: generateRandomId(),
      title: args.title,
      __typename: 'Book',
    };

    // updates the store
    context.patchQuery(
      gql`
        {
          books
        }
      `,
      data => {
        data.books.push(book);
      },
    );

    return book;
  }

  @Update('addBook')
  addToBooks(book, context) {
    // some logic
  }
}
```

We can move the update part to `addToBooks` method now. 

```typescript
export class BooksState {
  @Mutation('addBook')
  addBook(args, context) {
    return {
      id: generateRandomId(),
      title: args.title,
      __typename: 'Book',
    };
  }

  @Update('addBook')
  addToBooks({result}, context) {
    context.patchQuery(
      gql`
        {
          books
        }
      `,
      data => {
        data.books.push(result);
      },
    );
  }
}
```

Thanks to that it looks a bit cleaner now and we're able to pass the created object to not just one but many Updates.

Why would we need _many_ Updates? 

Imagine a state that not only has a list of books but also holds a recently added one. Instead of having two updates in the mutation resolver we can scale that and pass the book to any function.

### Updates of remote mutations

You can use Updates with not only client side but also the remote mutation that hits the GraphQL endpoint!

```graphql
mutation registerNewBook($title: String!) {
  registerNewBook(title: $title) {
    id
    title
  }
}
```

That's our mutation that gets to the GraphQL server. To attach an update to it you simply follow the same steps as you would with client side mutation:

```typescript
export class BooksState {
  @Update('registerNewBook')
  addToBooks({result}, context) {
    context.patchQuery(
      gql`
        {
          books
        }
      `,
      data => {
        data.books.push(result);
      },
    );
  }
}
```


