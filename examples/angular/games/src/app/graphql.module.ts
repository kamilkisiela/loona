import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApolloClientOptions} from 'apollo-client';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {LoonaModule} from '@loona/angular';

import {GamesState} from './games/games.state';

export function apolloFactory(httpLink: HttpLink): ApolloClientOptions<any> {
  const link = httpLink.create({
    uri: 'https://graphql-games-example.glitch.me/',
  });

  return {
    link,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  imports: [CommonModule, LoonaModule.forRoot([GamesState])],
  exports: [ApolloModule, HttpLinkModule, LoonaModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: apolloFactory,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
