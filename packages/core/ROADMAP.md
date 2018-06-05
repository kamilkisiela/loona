# Task List

- [x] define mutations
- [x] define updates
- [ ] define actions
- [ ] place for Type resolvers
- [ ] lazy loading mutations (I guess it requires to change apollo-link-state a bit, or maybe not) (SEE Q3)
- [ ] lazy loading updates (this won't require any change outside this library) (SEE Q3)
- [ ] refactor A LOT to make it look A LOT cleaner
- [ ] find a way to use it with other Apollo Links (SEE Q2)
- [x] find a way to use it with any Apollo Cache implementation (SEE Q2)
- [ ] maybe move all into Apollo Link and create a Client (SEE Q2)
- [ ] maybe drop mutations and use just actions (but then do we still have updates?) (SEE Q1)
- [ ] add a layer that manages Upates (SEE Q3)
- [ ] add a layer that manages Mutation (SEE Q3)
- [ ] add a layer that manages Queries (SEE Q3)
- [ ] add a layer that manages Actions (SEE Q3)

## Problem

Right now everyone use Apollo directly or "near" directly (via Services in Angular) in their components.

TODO: Write more...

## Purpose

The whole idea is to move the logic outside the components, centralize the application's state and to split logic into smaller parts.

Mutations suppose to mutate data, in fact it does but we can move some logic outside of the resolver.

Imagine this example.
We call a mutation to create an entity. Mutation creates a fragment, writes it to the store.
We also have a query that holds list of entities and it needs to be updated, so mutation has more stuff to do. There could be 2 or more queries related to that mutation.
This is why I tried to move those relations outside the mutation, this way mutation is responsible for an entity, and not the whole store.

TODO: Write more...

### Mutations

Their main goal is to create / update an entity, nothing more.

### Updates

They live next between Mutations and Queries. If mutation happens, updates can listen to it and update other parts of store, in most cases it will be a query.

### Queries

Nothing new here. You want something, you query it.

### Actions

A place to add some call mutations or

## Q&A

- Q1: what if we want to fetch something using network and use the result in a mutation, based on an action?

Let's say we've got an action called `FIND_BOOKS`. It will fetch results from an API and call `FIND_BOOKS_SUCCESS` with the result. This action should call a mutation to pass the results to the store.

Something like `Effects` in ngrx.

- Q2: how to integrate it with an existing application?

Maybe we should split this into an Apollo Link and a Client.

The Link would handle `apollo-link-state`, would be somehow connected to the store where Queries, Resolvers lives.
The Client would have an API to dispatch actions, query data and mutate data.

- Q3: how to allow for lazy loading queries, mutation, actions, updates etc?

The `apollo-link-state` accepts options object that contains a `resolvers` property. It's called every time an operation happens. We could make it a getter that would return always fresh resolvers.

I hope this could work, otherwise we would have to introduce some changes to `apollo-link-state`.
