<p align="center"><a href="https://loonajs.com"><img src="https://loonajs.com/img/logo-big.png" alt="Loona" height="70px"></a></p>

[![CircleCI](https://circleci.com/gh/kamilkisiela/loona.svg?style=shield)](https://circleci.com/gh/kamilkisiela/loona) [![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/loona)

**Loona is a state management library built on top of Apollo Client.** It brings the simplicity of managing remote data with Apollo, to your local state. Instead of maintaining a second store for your local data with tools like Redux, MobX or NGRX, use Loona to **keep data in just one space and make it a single source of truth**.

With Loona you get all the benefits of Apollo, like caching, offline persistence and more. On top of that you gain all the other benefits like stream of actions, better sepatation between mutation and store updates.

## UI Frameworks

Loona works with [**React**](./packages/react/README.md) and [**Angular**](./packages/angular/README.md):

- [`@loona/angular`](https://npmjs.org/package/@loona/angular)
- [`@loona/react`](https://npmjs.org/package/@loona/react)

## Documentation

All of the documentation for Loona including usage articles and helpful recipes lives on [loonajs.com](https://loonajs.com).

## Read about Loona

- [Introducing Loona](https://medium.com/the-guild/loona-state-management-graphql-77baf6734f1)

## Features

- **Single store** - Keep your remote and local data in just one space and make it a single source of truth.
- **Separation of concerns** - Loona helps you to keep every piece of your data flow separated.
- **Benefits of Apollo** - You get all the benefits of Apollo, like caching, offline persistence and more.
- **Works on Mobile** - Works out of the box with React Native and NativeScript.

## Concept

Loona can be described by few core concepts. First two of them are related to GraphQL:

- **Queries** - ask for what you need.
- **Mutations** - a way to modify your remote and local data.
- **Store** - a single source of truth of all your data.

It also uses a concept of:

- **Actions** - declarative way to call a mutation or trigger a different action
- **Updates** - modify the store after a mutation happens

By having it all, Loona helps you to keep every piece of your data's flow separated.

---

## Contributing

This project uses Lerna.

Bootstraping:

```bash
yarn install
```

Running tests locally:

```bash
yarn test
```

Formatting code:

```bash
yarn format
```

This project uses TypeScript for static typing. You can get it built into your editor with no configuration by opening this project in [Visual Studio Code](https://code.visualstudio.com/), an open source IDE which is available for free on all platforms.
