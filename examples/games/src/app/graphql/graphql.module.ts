import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApolloClientOptions } from 'apollo-client';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { LunaModule, LunaLink } from '@luna/angular';

import { Games } from './state';

const cache = new InMemoryCache();

export function apolloFactory(
  httpLink: HttpLink,
  lunaLink: LunaLink,
): ApolloClientOptions<any> {
  const link = lunaLink.concat(
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
  imports: [CommonModule, LunaModule.forRoot(cache, [Games])],
  exports: [ApolloModule, HttpLinkModule, LunaModule],
  providers: [
    Games,
    {
      provide: APOLLO_OPTIONS,
      useFactory: apolloFactory,
      deps: [HttpLink, LunaLink],
    },
  ],
})
export class GraphQLModule {}
