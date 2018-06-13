import { NgModule, ModuleWithProviders } from '@angular/core';
import { ApolloCache } from 'apollo-cache';
import { Manager as Connector } from '@apollo-flux/core';

import { ApolloFlux } from './client';
import {
  INITIAL_STATE,
  FEATURE_STATE,
  APOLLO_CACHE,
  CONNECTOR,
} from './tokens';
// import { extractDefaults } from './state';
import { extractQueries } from './query';
import { extractMutations } from './mutation';

@NgModule({
  providers: [ApolloFlux],
})
export class FluxRootModule {}

@NgModule()
export class FluxFeatureModule {}

@NgModule()
export class FluxModule {
  static forRoot(
    cache: ApolloCache<any>,
    states: any[] = [],
  ): ModuleWithProviders {
    return {
      ngModule: FluxRootModule,
      providers: [
        {
          provide: CONNECTOR,
          useFactory: connectorFactory,
          deps: [INITIAL_STATE],
        },
        ...states,
        { provide: APOLLO_CACHE, useValue: cache },
        { provide: INITIAL_STATE, useValue: states },
      ],
    };
  }

  static forFeature(states: any[] = []): ModuleWithProviders {
    return {
      ngModule: FluxFeatureModule,
      providers: [...states, { provide: FEATURE_STATE, useValue: states }],
    };
  }
}

// TODO: connector that lives inbetween Link and Client
function connectorFactory(states: any[]) {
  const queries = extractQueries(states);
  const mutations = extractMutations(states);

  return new Connector({
    queries,
    mutations,
  });
}
