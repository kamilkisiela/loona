import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApolloClientOptions } from 'apollo-client';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';

import { defaultState, resolvers } from './state';

export function apolloFactory(httpLink: HttpLink): ApolloClientOptions<any> {
  const cache = new InMemoryCache();
  const state = withClientState({
    cache,
    defaults: defaultState,
    resolvers,
  });
  const link = state.concat(
    httpLink.create({
      uri: 'https://nx8m7pwxn7.lp.gql.zone/graphql',
    }),
  );

  return {
    link,
    cache,
  };
}

@NgModule({
  imports: [CommonModule],
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: apolloFactory,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
