---
title: React - Mutations
sidebar_label: Mutations
---

Mutation are a way to modify your remote and local data.

## Getting started with Mutations

In this section we will try to explain how to define and use mutations. We're going to create a resolver function and use it inside of a component.

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

As you can tell, we follow the same example as in the previous chapter about queries. We've got a list of books. What's new here, is the `addBook` mutation.

We created a function that is called _resolver_, it accepts an object with arguments and a [context](../api/context). You can see the similarities between your server side resolver and this one, both accepts the same arguments, but on the client side it's a bit simplified.

The addBook resolver doesn't do much at the moment but it's purspose is to add a new book to the list. Let's see how it might look like!

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

Let me explain what actually happened here.

First, we created a Book object, with a random id and a received title. Then we updated the store using `patchQuery` method.

What is `patchQuery` method?

As you can see it accepts a graphql query and a function that modifies the result of that query. But why do we need to make a query at the first place, you might ask. Because of how store works. You can write some data to the store directly but to update something that is already in it you need to first, read it, then mutate and the end, write it.

That's why we created the `patchQuery` helper. Under the hood it takes the query to read the store and inside of the function you access the result to modify it. In the example we showed you, we just pushed a new book to the list. The patchQuery method knows what you changed and writes it to the store. It's just a more convinent way of modifying data.

Now when you would query the list of books you would see it got updated.

So how to actually make a mutation from a component?

### How to mutate data

To query data, we use the `Query` component, surprise surprise, we use `Mutation` for mutations.

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

By calling the `addBook` function, you push a new book to the list.

Remember a component that we created in the previous chapter? It should show our new book now!
