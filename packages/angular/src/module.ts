import {NgModule, ModuleWithProviders, Injector, Inject} from '@angular/core';
import {ApolloCache} from 'apollo-cache';
import {
  Manager,
  QueryDef,
  MutationDef,
  ResolverDef,
  UpdateDef,
  LoonaLink,
} from '@loona/core';

import {Loona} from './client';
import {Actions} from './actions';
import {Dispatcher} from './internal/dispatcher';
import {Effects} from './internal/effects';
import {INITIAL_STATE, CHILD_STATE, LOONA_CACHE} from './tokens';
import {StateClass} from './types/state';
import {METADATA_KEY} from './metadata/metadata';
import {
  transformQueries,
  transformMutations,
  transformUpdates,
  transformResolvers,
} from './internal/transform-metadata';
import {isString} from './internal/utils';

@NgModule({
  providers: [Loona, Dispatcher],
})
export class LoonaRootModule {
  constructor(effects: Effects) {
    effects.start();
  }
}

@NgModule()
export class LoonaChildModule {
  constructor(
    @Inject(LOONA_CACHE) cache: ApolloCache<any>,
    @Inject(CHILD_STATE) states: any[],
    injector: Injector,
    manager: Manager,
    effects: Effects,
  ) {
    // [ ] add fragment matcher (for later)
    let defaults: any = {};

    states.forEach(state => {
      const instance = injector.get(state);
      const meta = state[METADATA_KEY];

      // [x] add mutations
      manager.mutations.add(transformMutations(instance, meta));
      // [x] add updates
      manager.updates.add(transformUpdates(instance, meta) || []);
      // [x] add resolvers
      manager.resolvers.add(transformResolvers(instance, meta) || []);
      defaults = {
        ...defaults,
        ...meta.defaults,
      };

      if (meta.typeDefs) {
        if (!manager.typeDefs) {
          manager.typeDefs = [];
        }

        if (typeof manager.typeDefs === 'string') {
          manager.typeDefs = [manager.typeDefs];
        }

        // [x] add typeDefs
        manager.typeDefs.push(
          ...(isString(meta.typeDefs) ? [meta.typeDefs] : meta.typeDefs),
        );
      }
    });

    // [x] write defaults
    cache.writeData({
      data: defaults,
    });

    // [x] add states to effects
    const resolvedStates = states.map(state => {
      const instance = injector.get(state);
      const meta = state[METADATA_KEY];

      return {
        actions: meta.actions,
        instance,
      };
    });

    effects.add(resolvedStates);
  }
}

@NgModule()
export class LoonaModule {
  static forRoot(states: any[] = []): ModuleWithProviders {
    return {
      ngModule: LoonaRootModule,
      providers: [
        Actions,
        Effects,
        ...states,
        {provide: INITIAL_STATE, useValue: states},
        {
          provide: LoonaLink,
          useFactory: linkFactory,
          deps: [Manager],
        },
        {
          provide: Manager,
          useFactory: managerFactory,
          deps: [INITIAL_STATE, LOONA_CACHE, Injector],
        },
      ],
    };
  }

  static forChild(states: any[] = []): ModuleWithProviders {
    return {
      ngModule: LoonaChildModule,
      providers: [...states, {provide: CHILD_STATE, useValue: states}],
    };
  }
}

export function linkFactory(manager: Manager): LoonaLink {
  return new LoonaLink(manager);
}

export function managerFactory(
  states: StateClass[],
  cache: ApolloCache<any>,
  injector: Injector,
): Manager {
  let queries: QueryDef[] = [];
  let mutations: MutationDef[] = [];
  let resolvers: ResolverDef[] = [];
  let updates: UpdateDef[] = [];
  let defaults: any = {};
  let typeDefs: Array<string> = [];

  states.forEach(state => {
    const instance = injector.get(state);
    const meta = state[METADATA_KEY];

    queries = queries.concat(transformQueries(instance, meta));
    mutations = mutations.concat(transformMutations(instance, meta));
    updates = updates.concat(transformUpdates(instance, meta) || []);
    resolvers = resolvers.concat(transformResolvers(instance, meta) || []);
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

  return new Manager({
    cache,
    queries,
    resolvers,
    mutations,
    updates,
    defaults,
    typeDefs: [...typeDefs],
  });
}
