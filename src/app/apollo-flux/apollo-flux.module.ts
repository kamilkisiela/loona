import {
  NgModule,
  InjectionToken,
  Inject,
  APP_INITIALIZER,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApolloModule, Apollo } from 'apollo-angular';
import { withClientState } from 'apollo-link-state';
import { InMemoryCache } from 'apollo-cache-inmemory';
import merge from 'lodash.merge';

export interface ClientState {
  resolvers?: any;
  defaults?: any;
  typeDefs?: any;
}

export const ClientState = new InjectionToken<ClientState>(
  '[Apollo Flux] Client State',
);

export function initializeApolloFlux(
  apollo: Apollo,
  clientState: ClientState[],
) {
  return () => {
    const cache = new InMemoryCache();

    apollo.create({
      cache,
      link: withClientState(merge({ cache }, ...clientState)),
    });
  };
}

@NgModule({
  imports: [CommonModule, ApolloModule],
  declarations: [],
})
export class ApolloFluxModule {
  static forRoot(clientState: ClientState) {
    return {
      ngModule: ApolloFluxModule,
      providers: [
        { provide: ClientState, useValue: clientState, multi: true },
        {
          provide: APP_INITIALIZER,
          useFactory: initializeApolloFlux,
          deps: [Apollo, ClientState],
          multi: true,
        },
      ],
    };
  }
}
