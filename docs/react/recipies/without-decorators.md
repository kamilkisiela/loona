---
title: React - Using without decorators
sidebar_label: Using without decorators
---

Decorators in JavaScript are still just in a proposal phase and many tools, for example Create React App, do not support it. Because of that, we decided to provide a small utility to make possible using Loona without decorators.

> We highly recommend to use [TypeScript](http://www.typescriptlang.org) where decorators work out of the box.

## How to use Loona without decorators

Let's define an example state, without decorators:

```typescript
export class BooksState {
  addBook({title}) {
    // logic
  }

  updateBooks(mutation, {patchQuery}) {
    // logic
  }
}
```

As you can see, it's still a class with exactly the same interface as in other pages of the documentation. So how to decorate that class?

### State decorator

First, we want to wrap the BooksState class with `state` decorator. Decorator is nothing different from a higher order component. It's just a function, so let's use it as a function.

```typescript
import {state} from '@loona/react';

state()(BooksState);
```

If you want to define options like `defaults` or `typeDefs` you simply provide an object as the first argument of `state` function:

```typescript
import {state} from '@loona/react';

state({
  defaults: {
    books: [],
  },
})(BooksState);
```

### Other decorators

Now let's jump to something a bit more complex. Adding a state was easy but how to decorate methods?

We're going to use that utility function we mentioned before, it's called `decorated`.

Okay, you need to import `decorate` function from `@loona/react` module and as an example, we will use `mutation` decorator too:

```typescript
import {decorate, mutation} from '@loona/react';

// .. state definition

decorate(BooksState, {
  addBook: mutation(AddBook),
});
```

What we did here:

- we used `decorate` function
- passed our state as the first argument because this is an object we want to decorate
- in the second argument, we created a map, where key points to name of the method and as value, we defined a decorator

Once again.

```typescript
decorate(BooksState
```

It says we want to add some decorators to the BooksState object.

```typescript
{
  addBook: ...
}
```

It's a map and _addBook_ key points to _addBook_ method of BooksState class.

```typescript
{
  addBook: mutation(AddBook);
}
```

Attaches `mutation(AddBook)` decorator to the _addBook_ method.

But what about other decorators? If you want to add many you just add them to the map:

```typescript
decorate(BooksState, {
  addBook: mutation(AddBook),
  updateBooks: mutation(AddBook),
});
```

### Summary

Let's see how it all look together:

```typescript
import {decorate, state, mutation, update} from '@loona/react';

export class BooksState {
  addBook({title}) {
    // logic
  }

  updateBooks(mutation, {patchQuery}) {
    // logic
  }
}

state({
  defaults: {
    books: [],
  },
})(BooksState);

decorate(BooksState, {
  addBook: mutation(AddBook),
  updateBooks: mutation(AddBook),
});
```
