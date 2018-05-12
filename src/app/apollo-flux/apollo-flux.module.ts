import { NgModule, APP_INITIALIZER, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApolloModule, Apollo } from 'apollo-angular';
import { withClientState } from 'apollo-link-state';
import { InMemoryCache } from 'apollo-cache-inmemory';
import merge from 'lodash.merge';

import { MUTATIONS_SUBJECT_PROVIDERS } from './mutations-subject';
import { MUTATION_MANAGER_PROVIDERS } from './mutation-manager';
import { UPDATE_MANAGER_PROVIDERS } from './update-manager';
import { ApolloFlux } from './apollo-flux';
import { MutationDef, UpdateFn, State } from './models';
import { INITIAL_MUTATIONS, INITIAL_UPDATES, INITIAL_STATE } from './tokens';

export function initializeApolloFlux(apollo: Apollo, clientState: State[]) {
  return () => {
    const cache = new InMemoryCache();

    // TODO: allow to pass custom configuration
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
  static forRoot({
    state,
    mutations,
    updates,
  }: {
    state: State;
    mutations: MutationDef[];
    updates: UpdateFn[];
  }) {
    return {
      ngModule: ApolloFluxModule,
      providers: [
        { provide: INITIAL_STATE, useValue: state },
        {
          provide: INITIAL_MUTATIONS,
          useValue: mutations.reduce(
            (map, mutation) => ({
              ...map,
              [mutation.name]: mutation,
            }),
            {},
          ),
        },
        {
          provide: INITIAL_UPDATES,
          useValue: [...updates],
        },
        {
          provide: APP_INITIALIZER,
          useFactory: initializeApolloFlux,
          deps: [Apollo, INITIAL_STATE],
          multi: true,
        },
        ...MUTATIONS_SUBJECT_PROVIDERS,
        ...MUTATION_MANAGER_PROVIDERS,
        ...UPDATE_MANAGER_PROVIDERS,
        ApolloFlux,
      ],
    };
  }
}
