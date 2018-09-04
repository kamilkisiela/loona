import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApolloClientOptions} from 'apollo-client';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {LoonaModule, LoonaLink, LOONA_CACHE} from '@loona/angular';

import {TodosState} from './todos/todos.state';

export function apolloFactory(
  loonaLink: LoonaLink,
  cache: InMemoryCache,
): ApolloClientOptions<any> {
  return {
    link: loonaLink,
    cache,
  };
}

@NgModule({
  imports: [CommonModule, LoonaModule.forRoot([TodosState])],
  exports: [ApolloModule, LoonaModule],
  providers: [
    {
      provide: LOONA_CACHE,
      useFactory() {
        return new InMemoryCache();
      },
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory: apolloFactory,
      deps: [LoonaLink, LOONA_CACHE],
    },
  ],
})
export class GraphQLModule {}
