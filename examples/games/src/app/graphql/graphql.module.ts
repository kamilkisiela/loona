import { NgModule, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApolloClientOptions } from 'apollo-client';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {
  FluxModule,
  FluxLink,
  MutationsSubject,
  ApolloFlux,
} from '@apollo-flux/angular';
import { Subscription } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

import { Games } from './state';
import {
  ResetCurrentGame,
  GameCreationFailure,
  GameCreationSuccess,
} from './mutations';

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
export class GraphQLModule implements OnDestroy {
  sub: Subscription;

  constructor(mutations: MutationsSubject, flux: ApolloFlux) {
    this.sub = mutations
      .pipe(
        tap(result => {
          console.log('tap', result);
        }),
        filter(({ name }) => name === 'createGame'),
        tap({
          next() {
            flux.dispatch(new GameCreationSuccess());
            flux.dispatch(new ResetCurrentGame());
          },
          error() {
            flux.dispatch(new GameCreationFailure());
          },
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = undefined;
    }
  }
}
