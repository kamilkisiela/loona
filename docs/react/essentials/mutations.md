---
title: React - Mutations
sidebar_label: Mutations
---

Mutations are a way to modify your remote and local data.

## Getting started with Mutations

In this section we will explain how to define and use mutations. We'll begin by creating a resolver function and then using it within a component.

### How to define a mutation

As always, we define everything through State classes:

```typescript
import {state, mutation} from '@loona/react';

@state({
  defaults: {
    books: [],
  },
})
export class BooksState {
  @mutation('addBook')
  addBook(args, context) {
    //
  }
}
```

As you can see, we're following the example used in the previous chapter about queries. We've got a list of books. What's new here is the `addBook` mutation.

We created a function, called a _resolver_, which accepts an object with arguments as its first parameter, and a [context](../api/context) as its second. You can see the similarities between your server side resolver and this one - both accept the same arguments, but on the client side it's slightly simplified.

The addBook resolver doesn't do much at the moment, but its purpose is to add a new book to the list. Let's see how it might look!

```typescript
export class BooksState {
  @mutation('addBook')
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
          books {
            id
            title
          }
        }
      `,
      data => {
        data.books.push(book);
      },
    );

    return book;
  }
}
```

Let's explain what actually happened here.

First, we created a Book object, with a random id and a received title. Then we updated the store using the `patchQuery` method.

What is the `patchQuery` method?

As you can see it accepts a GraphQL query and a function that modifies the result of that query. But why do we need to make a query in the first place, you might ask? Because of how the store works - you can write data to the store directly, but to update something that is already in it, you need to first read it, then mutate it, and at the end, write it.

That's why we have the `patchQuery` helper. Under the hood it takes the query to read the store, and gives you access to the result to modify within the modifier function. In the example above, we just pushed a new book to the list. The patchQuery method knows what you changed and writes it to the store. It's just a more convinent way of modifying data.

Now if you were to query the list of books, you would see that it had been updated.

So how do we actually make a mutation from a component?

### How to mutate data

To query data, we use the `Query` component; surprise surprise, we use `Mutation` for mutations.

```typescript
const addNewBook = gql`
  mutation AddNewBook($title: String!) {
    addBook(title: $title) @client {
      id
      title
    }
  }
`;
```

It's important to use the `@client` directive. It tells Loona we want to make a client side mutation of the local state.

```jsx
import {Mutation} from '@loona/react';

const NewBook = () => (
  <Mutation mutation={addNewBook}>
    {(addBook, {data}) => (
      <form
        onSubmit={e => {
          e.preventDefault();
          addBook({variables: {title: input.value}});
          input.value = '';
        }}
      >
        <input
          ref={node => {
            input = node;
          }}
        />
        <button type="submit">Submit Book</button>
      </form>
    )}
  </Mutation>
);
```

By calling the `addBook` function, we'll push a new book to the list.

Remember the component we created in the previous chapter? It should show our new book now!
