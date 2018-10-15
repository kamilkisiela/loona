<p align="center"><a href="https://loonajs.com"><img src="https://loonajs.com/img/logo-big.png" alt="Loona" height="70px"></a></p>

[![npm version](https://badge.fury.io/js/%40loona%2Freact.svg)](https://npmjs.org/package/@loona/react) [![CircleCI](https://circleci.com/gh/kamilkisiela/loona.svg?style=shield)](https://circleci.com/gh/kamilkisiela/loona)

**Loona is a state management library built on top of React Apollo.** It brings the simplicity of managing remote data with Apollo, to your local state. Instead of maintaining a second store for your local data with tools like Redux or MobX, use Loona to **keep data in just one space and make it a single source of truth**.

With Loona you get all the benefits of Apollo, like caching, offline persistence and more. On top of that you gain all the other benefits like stream of actions, better sepatation between mutation and store updates.

Loona requires _no_ complex build setup to get up and running and works out of the box with both [`create-react-app`](http://npmjs.com/package/create-react-app) and [ReactNative](https://facebook.github.io/react-native/) with a single install.

## Installation

It is simple to install Loona

```bash
yarn add @loona/react
```

That’s it! You may now use Loona in any of your React environments.

For an amazing developer experience you may also install the [Apollo Client Developer tools for Chrome](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm) which will give you inspectability into your remote and local data.

> Loona lives on top of React Apollo so you have to have it working in your application too!

## Documentation

All of the documentation for Loona including usage articles and helpful recipes lives on: [https://loonajs.com](https://loonajs.com)

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
