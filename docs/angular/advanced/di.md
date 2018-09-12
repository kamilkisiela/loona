---
title: Angular - Dependency Injection in States
sidebar_label: Dependency Injection
---

It's important to know that every State class is initialized like a regular Angular service. It opens up on everything that is available through the Dependency Injection!

### Usage

As a simple example, let's explore how you might use it with Effects:

```typescript
@State()
export class BooksState {
  constructor(private notificationService: NotificationService) {}

  @Effect(AddBook)
  bookAdded() {
    this.notificationService.notify('New book added!');
  }
}
```

### Inside of resolvers

What's more interesting, you can use services inside of resolvers!

```typescript
@State()
export class BooksState {
  constructor(private booksService: BooksService) {}

  @Resolve('Query.books')
  allBooks() {
    return this.booksService.all();
  }
}
```

Isn't that amazing?

### Caching

But there's more! 

Thanks to Apollo, when you have a service that fetches a book from a REST API, you gain caching for free! To achieve that, simply put the service inside of a resolver, like this:

```typescript
@State()
export class BooksState {
  constructor(private booksApi: BooksAPI) {}

  @Resolve('Query.book')
  book({ id }) {
    return this.booksApi.get(id);
  }
}
```

Now when you query a book Loona will ask Apollo for data, Apollo will check if it's in the store. If so, it will resolve with the data from the store without making an HTTP request. Otherwise, it will make a request, save data to the store and next time you will ask for it, it's already there! No more HTTP calls until you decide to make some.
