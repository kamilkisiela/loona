import {NgModule, ModuleWithProviders, Injector, Inject} from '@angular/core';
import {ApolloCache} from 'apollo-cache';
import {
  Manager,
  LoonaLink,
  METADATA_KEY,
  StateClass,
  Metadata,
} from '@loona/core';

import {Loona} from './client';
import {InnerActions, ScannedActions, Actions} from './actions';
import {EffectsRunner, Effects, mapStates, extractState} from './effects';
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

    const {names, add} = mapStates();

    states.forEach(state => {
      const {instance, meta} = extractState(state, injector);

      this.addEffects(instance, meta.effects);
      add((state as any).name);
    });

    loona.dispatch({
      type: ROOT_EFFECTS_INIT,
      states: names,
    });
  }

  addEffects(state: any, meta?: Metadata.Effects) {
    this.effects.addEffects(state, meta);
  }
}

@NgModule({})
export class LoonaChildModule {
  constructor(
    @Inject(CHILD_STATE) states: StateClass<Metadata>[],
    injector: Injector,
    manager: Manager,
    loona: Loona,
    rootModule: LoonaRootModule,
  ) {
    // [ ] add fragment matcher (for later)
    const {names, add} = mapStates();

    states.forEach(state => {
      const {instance, meta} = extractState(state, injector);

      manager.addState(instance, meta, handleObservable);
      rootModule.addEffects(instance, meta.effects);
      add((state as any).name);
    });

    loona.dispatch({
      type: UPDATE_EFFECTS,
      states: names,
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
  const manager = new Manager({
    cache,
  });

  states.forEach(state => {
    manager.addState(
      injector.get(state),
      state[METADATA_KEY],
      handleObservable,
    );
  });

  return manager;
}
