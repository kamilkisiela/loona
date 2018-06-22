import { NgModule, ModuleWithProviders, Injector } from '@angular/core';
import { ApolloCache } from 'apollo-cache';
import {
  Manager,
  QueryDef,
  MutationDef,
  UpdateDef,
  FluxLink,
} from '@apollo-flux/core';

import { ApolloFlux, MutationsSubject } from './client';
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
        MutationsSubject,
        {
          provide: FluxLink,
          useFactory: linkFactory,
          deps: [Manager],
        },
        {
          provide: Manager,
          useFactory: managerFactory,
          deps: [INITIAL_STATE, APOLLO_CACHE, Injector],
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

export function linkFactory(manager: Manager): FluxLink {
  return new FluxLink(manager);
}

// TODO: connector that lives inbetween Link and Client
export function managerFactory(
  states: StateClass[],
  cache: ApolloCache<any>,
  injector: Injector,
): Manager {
  let updates: UpdateDef[] = [];
  let queries: QueryDef[] = [];
  let mutations: MutationDef[] = [];
  let defaults: any = {};
  let typeDefs: Array<string> = [];

  states.forEach(state => {
    const instance = injector.get(state);
    const meta = state[METADATA_KEY];

    updates = updates.concat(transformUpdates(instance, meta));
    queries = queries.concat(transformQueries(instance, meta));
    mutations = mutations.concat(transformMutations(instance, meta));
    defaults = {
      ...defaults,
      ...meta.defaults,
    };

    if (meta.typeDefs) {
      typeDefs.push(
        ...(isString(meta.typeDefs) ? [meta.typeDefs] : meta.typeDefs),
      );
    }
  });

  updates = updates.filter(Boolean);
  queries = queries.filter(Boolean);
  mutations = mutations.filter(Boolean);
  typeDefs = typeDefs.filter(Boolean);

  return new Manager({
    cache,
    queries,
    mutations,
    updates,
    defaults,
    typeDefs: [...typeDefs],
  });
}

function isString(val: any): val is string {
  return typeof val === 'string';
}
