import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApolloClientOptions } from 'apollo-client';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { FluxModule, FluxLink } from '@apollo-flux/angular';

import { Games } from './state';

const cache = new InMemoryCache();

export function apolloFactory(
  httpLink: HttpLink,
  fluxLink: FluxLink,
): ApolloClientOptions<any> {
  const link = fluxLink.concat(
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
  imports: [CommonModule, FluxModule.forRoot(cache, [Games])],
  exports: [ApolloModule, HttpLinkModule, FluxModule],
  providers: [
    Games,
    {
      provide: APOLLO_OPTIONS,
      useFactory: apolloFactory,
      deps: [HttpLink, FluxLink],
    },
  ],
})
export class GraphQLModule {}
