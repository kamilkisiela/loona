import { NgModule, APP_INITIALIZER, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApolloClientOptions } from 'apollo-client';
import { ApolloModule, Apollo } from 'apollo-angular';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import merge from 'lodash.merge';

import { MUTATIONS_SUBJECT_PROVIDERS } from './mutations-subject';
import { MUTATION_MANAGER_PROVIDERS } from './mutation-manager';
import { UPDATE_MANAGER_PROVIDERS } from './update-manager';
import { TRACKING_MANAGER_PROVIDERS } from './tracking-manager'
import { ApolloFlux } from './apollo-flux';
import { MutationDef, UpdateFn, State } from './models';
import {
  INITIAL_MUTATIONS,
  INITIAL_UPDATES,
  INITIAL_STATE,
  INITIAL_APOLLO_OPTIONS,
} from './tokens';

export function initializeApolloFlux(
  apollo: Apollo,
  clientState: State[],
  options: ApolloClientOptions<any>,
) {
  return () => {
    const cache = options.cache;

    apollo.create({
      ...options,
      cache,
      link: withClientState(merge({ cache }, ...clientState)).concat(
        options.link,
      ),
    });
  };
}

@NgModule({
  imports: [CommonModule, ApolloModule],
  declarations: [],
})
export class ApolloFluxModule {
  static forRoot({
    apollo,
    state,
    mutations,
    updates,
  }: {
    apollo?: ApolloClientOptions<any>;
    state: State;
    mutations: MutationDef[];
    updates: UpdateFn[];
  }) {
    return {
      ngModule: ApolloFluxModule,
      providers: [
        { provide: INITIAL_STATE, useValue: state },
        { provide: INITIAL_APOLLO_OPTIONS, useValue: apollo },
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
          deps: [Apollo, INITIAL_STATE, INITIAL_APOLLO_OPTIONS],
          multi: true,
        },
        ...MUTATIONS_SUBJECT_PROVIDERS,
        ...MUTATION_MANAGER_PROVIDERS,
        ...UPDATE_MANAGER_PROVIDERS,
        ...TRACKING_MANAGER_PROVIDERS,
        ApolloFlux,
      ],
    };
  }
}
