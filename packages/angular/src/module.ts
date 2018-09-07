import {NgModule, ModuleWithProviders, Injector, Inject} from '@angular/core';
import {ApolloCache} from 'apollo-cache';
import {
  Manager,
  MutationDef,
  ResolverDef,
  UpdateDef,
  LoonaLink,
  transformMutations,
  transformUpdates,
  transformResolvers,
  METADATA_KEY,
  StateClass,
  Metadata,
} from '@loona/core';

import {Loona} from './client';
import {InnerActions, ScannedActions, Actions} from './actions';
import {EffectsRunner, Effects} from './effects';
import {
  INITIAL_STATE,
  CHILD_STATE,
  LOONA_CACHE,
  ROOT_EFFECTS_INIT,
  UPDATE_EFFECTS,
} from './tokens';
import {handleObservable} from './utils';

@NgModule({})
export class LoonaRootModule {
  constructor(
    private effects: Effects,
    @Inject(INITIAL_STATE) states: StateClass<Metadata>[],
    loona: Loona,
    runner: EffectsRunner,
    injector: Injector,
  ) {
    runner.start();

    states.forEach(state => {
      const instance = injector.get(state);
      const meta = state[METADATA_KEY];

      this.addEffects(instance, meta.effects);
    });

    loona.dispatch({
      type: ROOT_EFFECTS_INIT,
    });
  }

  addEffects(state: any, meta?: Metadata.Effects) {
    this.effects.addEffects(state, meta);
  }
}

@NgModule({})
export class LoonaChildModule {
  constructor(
    @Inject(LOONA_CACHE) cache: ApolloCache<any>,
    @Inject(CHILD_STATE) states: StateClass<Metadata>[],
    injector: Injector,
    manager: Manager,
    loona: Loona,
    rootModule: LoonaRootModule,
  ) {
    // [ ] add fragment matcher (for later)
    let defaults: any = {};

    states.forEach(state => {
      const instance = injector.get(state);
      const meta: Metadata = state[METADATA_KEY];

      manager.mutations.add(
        transformMutations(instance, meta, handleObservable),
      );
      manager.updates.add(
        transformUpdates(instance, meta, handleObservable) || [],
      );
      manager.resolvers.add(
        transformResolvers(instance, meta, handleObservable) || [],
      );

      rootModule.addEffects(instance, meta.effects);

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

        manager.typeDefs.push(
          ...(typeof meta.typeDefs === 'string'
            ? [meta.typeDefs]
            : meta.typeDefs),
        );
      }
    });

    loona.dispatch({
      type: UPDATE_EFFECTS,
      // TODO: attach all effects here
    });

    cache.writeData({
      data: defaults,
    });
  }
}

@NgModule()
export class LoonaModule {
  static forRoot(states: any[] = []): ModuleWithProviders {
    return {
      ngModule: LoonaRootModule,
      providers: [
        Loona,
        InnerActions,
        ScannedActions,
        {
          provide: Actions,
          useExisting: ScannedActions,
        },
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
        EffectsRunner,
        Effects,
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
  states: StateClass<Metadata>[],
  cache: ApolloCache<any>,
  injector: Injector,
): Manager {
  // [ ] fragment matcher
  let mutations: MutationDef[] = [];
  let resolvers: ResolverDef[] = [];
  let updates: UpdateDef[] = [];
  let defaults: any = {};
  let typeDefs: Array<string> = [];

  states.forEach(state => {
    const instance = injector.get(state);
    const meta = state[METADATA_KEY];

    mutations = mutations.concat(
      transformMutations(instance, meta, handleObservable),
    );
    updates = updates.concat(
      transformUpdates(instance, meta, handleObservable) || [],
    );
    resolvers = resolvers.concat(
      transformResolvers(instance, meta, handleObservable) || [],
    );
    defaults = {
      ...defaults,
      ...meta.defaults,
    };

    if (meta.typeDefs) {
      typeDefs.push(
        ...(typeof meta.typeDefs === 'string'
          ? [meta.typeDefs]
          : meta.typeDefs),
      );
    }
  });

  return new Manager({
    cache,
    resolvers,
    mutations,
    updates,
    defaults,
    typeDefs: [...typeDefs],
  });
}
