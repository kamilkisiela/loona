import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApolloClientOptions} from 'apollo-client';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {LoonaModule, Loona, Actions} from '@loona/angular';
import {ApolloLink, Observable} from 'apollo-link';

// example does not work
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
  imports: [CommonModule, LoonaModule.forRoot()],
  exports: [ApolloModule, LoonaModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: apolloFactory,
    },
  ],
})
export class GraphQLModule {
  constructor(actions: Actions, loona: Loona) {
    actions.subscribe(action => {
      console.log('scanned', action);
    });
  }
}
