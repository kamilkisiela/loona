---
title: React - Getting Started
sidebar_label: Getting Started
---

## Installation

Install Loona using [`yarn`](https://yarnpkg.com/en/package/jest):

```bash
yarn add @loona/react
```

Or [`npm`](https://www.npmjs.com/):

```bash
npm install --save @loona/react
```

## Creating Loona

Creating Loona is straightforward. We simply import the `createLoona` method and provide an Apollo Cache.

```typescript
import {createLoona} from '@loona/react';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';

// Instance of a cache
const cache = new InMemoryCache();

// Create Loona Link
const loona = createLoona(cache);

// Apollo
const client = new ApolloClient({
  link: loona,
  cache,
});
```

> At this point you should be familiar with React Apollo. Please [read the documentation](https://www.apollographql.com/docs/react) first

## Providing Loona to your application

Next, we need to provide Apollo and Loona to your application, so any component in a tree can use it:

```jsx
import { ApolloProvider } from 'react-apollo';
import { LoonaProvider } from '@loona/react';

ReactDOM.render(
  <ApolloProvider client={client}>
    <LoonaProvider loona={loona}>
      <App />
    </LoonaProvider>
  </ApolloProvider>,
  document.getElementById('root'),
);
```

Everything is now ready for your first State class!
