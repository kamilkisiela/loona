import { NgModule, ModuleWithProviders, Injector } from '@angular/core';
import { ApolloCache } from 'apollo-cache';
import { Manager, QueryDef, MutationDef, FluxLink } from '@apollo-flux/core';

import { ApolloFlux } from './client';
import { Actions } from './action';
import { Dispatcher } from './dispatcher';
import { Effects } from './effects';
import { INITIAL_STATE, FEATURE_STATE, APOLLO_CACHE } from './tokens';
import { StateClass } from './state';
import { METADATA_KEY } from './metadata';
import { transformQueries } from './query';
import { transformMutations } from './mutation';
import { isString } from './utils';

@NgModule({
  providers: [ApolloFlux, Dispatcher],
})
export class FluxRootModule {
  constructor(effects: Effects) {
    effects.start();
  }
}

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
        Actions,
        Effects,
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
  let queries: QueryDef[] = [];
  let mutations: MutationDef[] = [];
  let defaults: any = {};
  let typeDefs: Array<string> = [];

  states.forEach(state => {
    const instance = injector.get(state);
    const meta = state[METADATA_KEY];

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

  queries = queries.filter(Boolean);
  mutations = mutations.filter(Boolean);
  typeDefs = typeDefs.filter(Boolean);

  return new Manager({
    cache,
    queries,
    mutations,
    defaults,
    typeDefs: [...typeDefs],
  });
}
