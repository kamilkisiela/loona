import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApolloClientOptions} from 'apollo-client';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {LoonaModule, LoonaLink} from '@loona/angular';

import {TodosState} from './todos/todos.state';

const cache = new InMemoryCache();

export function apolloFactory(loonaLink: LoonaLink): ApolloClientOptions<any> {
  return {
    link: loonaLink,
    cache,
  };
}

@NgModule({
  imports: [CommonModule, LoonaModule.forRoot(cache, [TodosState])],
  exports: [ApolloModule, LoonaModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: apolloFactory,
      deps: [LoonaLink],
    },
  ],
})
export class GraphQLModule {}
