---
id: index
title: Getting Started
---

## Installation

Install Loona using [`yarn`](https://yarnpkg.com/en/package/jest):

```bash
yarn add @loona/angular
```

Or [`npm`](https://www.npmjs.com/):

```bash
npm install --save @loona/angular
```

## Creating Loona

As usual, Angular starts with modules. You need to import the `LoonaModule` from `@loona/angular`:

```typescript
import {NgModule} from '@angular/core';
import {LoonaModule} from '@loona/angular';

@NgModule({
  imports: [LoonaModule.forRoot()],
})
class AppModule {}
```

Did you notice `forRoot` method? It's the same thing as in `@angular/router` and other libraries. If it's a root module, use `forRoot`, if lazy-loaded one try `forChild`. They both accept one argument which is a [State]() or an array of them.

> It's important to use `LoonaModule.forRoot()` at the root module, even without a State.

## Loona and Apollo

Loona is built on top of [Apollo Angular](http://github.com/apollographql/apollo-angular) by taking advantage of the concept of Links.

> At this point you should be familiar with Apollo Angular. Please [read the documentation](https://www.apollographql.com/docs/angular) first

As you know, Apollo uses Links and a cache. Think of Link as a network stack but Cache is a store with all your data.
Loona wouldn't work without these two concepts. It uses cache to manage data and a `LoonaLink` to intercept every query and mutation you're calling.

## Creating Cache

First, let's create a cache and provide it to Loona:

```typescript
// `LOONA_CACHE` is an InjectionToken that contains a Cache
import {LoonaModule, LOONA_CACHE} from '@loona/angular';
import {InMemoryCache} from 'apollo-cache-inmemory';

const cache = new InMemoryCache();

@NgModule({
  imports: [LoonaModule.forRoot()],
  providers: [
    {
      provide: LOONA_CACHE,
      useValue: cache,
    },
  ],
})
class AppModule {}
```

## Using LoonaLink

Loona can access the Cache now but what about the Apollo Angular?
As the final step, let's create Apollo and use the `LoonaLink` in it:

```typescript
import {NgModule} from '@angular/core';
import {LoonaModule, LoonaLink, LOONA_CACHE} from '@loona/angular';
import {ApolloModule, Apollo} from 'apollo-angular';

@NgModule({
  imports: [ApolloModule, LoonaModule.forRoot()],
  providers: [
    {
      provide: LOONA_CACHE,
      useValue: cache,
    },
  ],
})
class AppModule {
  constructor(apollo: Apollo, loona: LoonaLink) {
    apollo.create({
      link: loona,
      cache,
    });
  }
}
```

Everything is now ready for your first State class!
