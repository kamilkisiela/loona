import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApolloClientOptions} from 'apollo-client';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {LoonaModule} from '@loona/angular';

import {TodosState} from './todos/todos.state';
import {ApolloLink, Observable} from 'apollo-link';

export function apolloFactory(): ApolloClientOptions<any> {
  return {
    link: new ApolloLink(
      operation =>
        new Observable(observer => {
          console.log(operation);
          observer.error('Should not be here');
        }),
    ),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  imports: [CommonModule, LoonaModule.forRoot([TodosState])],
  exports: [ApolloModule, LoonaModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: apolloFactory,
    },
  ],
})
export class GraphQLModule {}
