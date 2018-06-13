import { NgModule, ModuleWithProviders, Injector } from '@angular/core';
import { ApolloCache } from 'apollo-cache';
import { Manager, QueryDef, MutationDef, UpdateDef } from '@apollo-flux/core';

import { ApolloFlux } from './client';
import { INITIAL_STATE, FEATURE_STATE, APOLLO_CACHE } from './tokens';
import { StateClass } from './state';
import { METADATA_KEY } from './metadata';
import { transformUpdates } from './update';
import { transformQueries } from './query';
import { transformMutations } from './mutation';

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
          provide: Manager,
          useFactory: managerFactory,
          deps: [INITIAL_STATE, Injector],
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
function managerFactory(states: StateClass[], injector: Injector) {
  let updates: UpdateDef[] = [];
  let queries: QueryDef[] = [];
  let mutations: MutationDef[] = [];

  states.forEach(state => {
    const instance = injector.get(state);
    const meta = state[METADATA_KEY];

    updates = updates.concat(transformUpdates(instance, meta));
    queries = queries.concat(transformQueries(instance, meta));
    mutations = mutations.concat(transformMutations(instance, meta));
  }, []);

  return new Manager({
    queries,
    mutations,
    updates,
  });
}
