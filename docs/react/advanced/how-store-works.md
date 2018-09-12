---
title: React - How Store works
sidebar_label: How Store works
---

> Part of this chapter uses `apollo-cache-inmemory` as an example cache so the way it stores data might be different than in other libraries.

## Introduction

We will try to cover following:

- how data is stored
- writes and reads
- why it's a cache and not really a store for a state

## Normalized

This is how Apollo stores data:

```json
{
  "Book:1": {
    "id": 1,
    "title": "Book A",
    "__typename": "Book"
  },
  "ROOT_QUERY": {
    "books": [
      {
        "type": "id",
        "id": "Book:1",
        "typename": "Book"
      }
    ]
  }
}
```

It's not something you would expect to see and the shape is definitely different then what you would normally have with libraries like Redux or NGRX.

**It's normalized and there's a reason for that!**

Since we operate on objects and everything is a graph it means we've got relations. Instead of storing whole objects inside of an array, the InMemoryCache took a different approach. If uses references and every object is stored separately.

Let's split our example state into parts.

The `ROOT_QUERY` contains all the root fields that we can start queries with. In our case it has `books`. It might be a primitive value or a reference.

Reference?

```json
{
  "type": "id",
  "id": "Book:1",
  "typename": "Book"
}
```

Take a closer look, it has an object of type called `Book`, it's `id` equals `Book:1` which means:

```
<name_of_type>:<id_field>
```

It's something that InMemoryCache creates by default. You can change it in `dataIdFromObject`, it all explained [here](https://www.apollographql.com/docs/angular/features/cache-updates.html#normalization).

As you can see objects are saved separately:

```json
{
  "Book:1": {
    "id": 1,
    "title": "Book A",
    "__typename": "Book"
  }
}
```

What's important here is the `__typename` property, it's something that tells what is the type of that record. Also, the key matches the value produced by `dataIdFromObject`.

## Reads and writes

To read something from the store, you need to use queries. You can either use Loona service to read the cache inside of components or by accessing `context.cache` inside of mutations, resolvers, updates or even effects.

The `cache` has the following API:

- readFragment
- writeFragment
- readQuery
- writeQuery
- writeData

To understand each one of them, we highly recommend to read Apollo's documentation.

Loona has [much simpler API to do updates](../api/context), so reads and writes happen behind the scenes, for you!

We won't cover them all in details here but what you need to know is how Apollo Cache reads and writes data.

**How Apollo Cache reads data?**

```graphql
query AllBooks {
  books {
    id
    title
  }
}
```

To resolve that query, Apollo asks the Cache to check if the `ROOT_QUERY` field has `books` in it. If there's no `books` property, it hits the network (with `@client` directive it asks Loona and runs resolvers but without it asks the GraphQL Server). But we have the books record so the Cache sees it's an array and resolves every reference. It then passes the result to Apollo.

That's when we make a query through Loona service.

But what if we read store in through the context? It does the same except we don't use Apollo and we ask the Cache directly, so there's no network involved or Loona here.

**How Apollo Cache writes data?**

The same way as it reads the query but the other way around. First it checks how object looks like and based on `__typename` properties it separates every nested object into its own space. That's why you always need to add __typename field. 

> You can also use a [FragmentMatcher](https://www.apollographql.com/docs/angular/basics/caching.html#configuration) but that's something more advance that we won't cover here.

## Queries getting updated

By having object separated whenever we change something in them it reflects to the queries too. Apollo picks that up and emits new results to all components.

## Caching

We told you few times about some `network`. Don't think about it as an HTTP call to your GraphQL Server, it's not always true because of how Apollo architecture and Link especially.

Network means the stack of Apollo Links. In short.

You might be using a Link that makes an http request and ask your server for data but you might also use Loona, which handles client side requests.

Using Loona (and Apollo) might sometime require to define a fetching policy. The default one is called `cache-first` and it means if the query could be resolves with data that's already in the cache, then don't ask the network for it. It stops on the cache.

Other important fetch policy is `cache-and-network`. We find it very useful since it emits the result to components, from the cache, but in the meantime it asks the network for fresh data and then it updates components again.

But to always skip the cache (important if you use Loona's resolvers for queries) you might want to use `network-only` policy. It will always hit the network.

---

> To learn more about the Apollo Cache [visit the Apollo documentation](https://www.apollographql.com/docs/angular/features/cache-updates.html).
