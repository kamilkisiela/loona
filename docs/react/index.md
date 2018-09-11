---
title: What is Loona?
---

Loona is a state management library built on top of React Apollo. It brings the simplicity of managing remote data with Apollo, to your local state. Instead of maintaining a second store for your local data with tools like Redux, MobX or NGRX, use Loona to keep data in just one space and make it a single source of truth.

With Loona you get all the benefits of Apollo, like caching, offline persistence and more. On top of that you gain all the other benefits like stream of actions, better sepatation between mutation and store updates.

Loona requires _no_ complex build setup to get up and running and works out of the box with both [Create React App](https://npmjs.org/package/create-react-app) and [React Native](https://facebook.github.io/react-native/) with a single install.

# Concept

Loona can be described by few core concepts. First two of them are related to GraphQL:

- **Queries** - ask for what you need.
- **Mutations** - a way to modify your remote and local data.
- **Store** - a single source of truth of all your data.

It also uses a concept of:

- **Actions** - declarative way to call a mutation or trigger a different action
- **Updates** - modify the store after a mutation happens

By having it all, Loona helps you to keep every piece of your data's flow separated.

We prepared a dedicated page for each of the concepts:

- [State](./essentials/state)
- [Queries](./essentials/queries)
- [Mutations](./essentials/mutations)
- [Updates](./essentials/updates)
- [Actions handlers](./essentials/effects) (called Effects)