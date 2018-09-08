import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApolloClientOptions} from 'apollo-client';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {
  LoonaModule,
  LoonaLink,
  LOONA_CACHE,
  Loona,
  Actions,
} from '@loona/angular';
import {ApolloCache} from 'apollo-cache';

export function apolloFactory(
  loonaLink: LoonaLink,
  cache: ApolloCache<any>,
): ApolloClientOptions<any> {
  return {
    link: loonaLink,
    cache,
  };
}

@NgModule({
  imports: [CommonModule, LoonaModule.forRoot()],
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
export class GraphQLModule {
  constructor(actions: Actions, loona: Loona) {
    actions.subscribe(action => {
      console.log('scanned', action);
      // loona.dispatch({type: 'test'});
    });
  }
}
