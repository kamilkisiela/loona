# [Loona](https://loona.netlify.com/docs/angular/) [![npm version](https://badge.fury.io/js/%40loona%2Fangular.svg)](https://badge.fury.io/js/@loona/angular) [![CircleCI](https://circleci.com/gh/kamilkisiela/loona.svg?style=svg)](https://circleci.com/gh/kamilkisiela/loona)

Loona is a state management library built on top of Apollo Angular. It brings the simplicity of managing remote data with Apollo, to your local state. Instead of maintaining a second store for your local data with tools like Redux, MobX or NGRX, use Loona to keep data in just one space and make it a single source of truth.

With Loona you get all the benefits of Apollo, like caching, offline persistence and more. On top of that you gain all the other benefits like stream of actions, better sepatation between mutation and store updates.

Loona requires _no_ complex build setup to get up and running and works out of the box with both [Angular CLI](https://cli.angular.io/) (`ng add @loona/angular`) and [NativeScript](https://www.nativescript.org/) with a single install.

## Installation

It is simple to install Loona and related libraries

```bash
# installing Loona in Angular CLI
ng add @loona/angular

# or with yarn
yarn add @loona/angular
```

That’s it! You may now use Loona in any of your Angular environments.

For an amazing developer experience you may also install the [Apollo Client Developer tools for Chrome](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm) which will give you inspectability into your remote and local data.

> Loona lives on top of Apollo Angular so you have to have it working in your application too!

## Documentation

All of the documentation for Loona including usage articles and helpful recipes lives on: [https://loona.netlify.com/docs/angular/](https://loona.netlify.com/docs/angular/)

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
