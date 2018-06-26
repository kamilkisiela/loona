import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApolloClientOptions } from 'apollo-client';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { LoonaModule, LoonaLink } from '@loona/angular';

import { GamesState } from './games/games.state';

const cache = new InMemoryCache();

export function apolloFactory(
  httpLink: HttpLink,
  loonaLink: LoonaLink,
): ApolloClientOptions<any> {
  const link = loonaLink.concat(
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
  imports: [CommonModule, LoonaModule.forRoot(cache, [GamesState])],
  exports: [ApolloModule, HttpLinkModule, LoonaModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: apolloFactory,
      deps: [HttpLink, LoonaLink],
    },
  ],
})
export class GraphQLModule {}
