import {NgModule, ModuleWithProviders, Injector, Inject} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Manager, StateClass, Metadata} from '@loona/core';

import {Loona} from './client';
import {InnerActions, ScannedActions, Actions} from './actions';
import {EffectsRunner, Effects, mapStates, extractState} from './effects';
import {
  INITIAL_STATE,
  CHILD_STATE,
  ROOT_EFFECTS_INIT,
  UPDATE_EFFECTS,
} from './tokens';
import {handleObservable} from './utils';

@NgModule()
export class LoonaRootModule {
  constructor(
    private effects: Effects,
    @Inject(INITIAL_STATE) states: StateClass<Metadata>[],
    loona: Loona,
    manager: Manager,
    runner: EffectsRunner,
    injector: Injector,
  ) {
    runner.start();

    const {names, add} = mapStates();

    states.forEach(state => {
      const {instance, meta} = extractState(state, injector);

      manager.addState(instance, meta, handleObservable);
      this.addEffects(instance, meta.effects);
      add(instance);
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

@NgModule()
export class LoonaChildModule {
  constructor(
    @Inject(CHILD_STATE) states: StateClass<Metadata>[],
    injector: Injector,
    manager: Manager,
    loona: Loona,
    rootModule: LoonaRootModule,
  ) {
    const {names, add} = mapStates();

    states.forEach(state => {
      const {instance, meta} = extractState(state, injector);

      manager.addState(instance, meta, handleObservable);
      rootModule.addEffects(instance, meta.effects);
      add(instance);
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
          provide: Manager,
          useFactory: managerFactory,
          deps: [Injector],
        },
        Effects,
        EffectsRunner,
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

export function managerFactory(injector: Injector): Manager {
  const manager = new Manager({
    getClient: () => injector.get(Apollo).getClient(),
  });

  return manager;
}
