import {
  buildContext,
  getNameOfMutation,
  isMutationAsAction,
  Metadata,
  EffectMethod,
  Action,
  ActionContext,
  StateClass,
  METADATA_KEY,
} from '@loona/core';
import {Injectable, Inject, OnDestroy, Injector} from '@angular/core';
import {ApolloCache} from 'apollo-cache';
import {Subscription} from 'rxjs';

import {Loona} from './client';
import {LOONA_CACHE} from './tokens';
import {ScannedActions} from './actions';

@Injectable()
export class EffectsRunner implements OnDestroy {
  private actionsSubscription: Subscription | null = null;

  constructor(
    private effects: Effects,
    private scannedActions: ScannedActions,
  ) {}

  start() {
    if (!this.actionsSubscription) {
      this.actionsSubscription = this.scannedActions.subscribe(action => {
        this.effects.runEffects(action);
      });
    }
  }

  ngOnDestroy() {
    if (this.actionsSubscription) {
      this.actionsSubscription.unsubscribe();
      this.actionsSubscription = null;
    }
  }
}

@Injectable()
export class Effects {
  effects: Record<string, Array<EffectMethod>> = {};
  context: ActionContext;

  constructor(loona: Loona, @Inject(LOONA_CACHE) cache: ApolloCache<any>) {
    this.context = {
      ...buildContext({
        cache,
        getCacheKey: (obj: {__typename: string; id: string | number}) => {
          if ((cache as any).config) {
            return (cache as any).config.dataIdFromObject(obj);
          } else {
            throw new Error(
              'To use context.getCacheKey, you need to use a cache that has a configurable dataIdFromObject, like apollo-cache-inmemory.',
            );
          }
        },
      }),
      dispatch: loona.dispatch.bind(loona),
    };
  }

  addEffects(instance: any, meta?: Metadata.Effects) {
    if (!meta) {
      return;
    }

    for (const type in meta) {
      if (!this.effects[type]) {
        this.effects[type] = [];
      }

      meta[type].forEach(({propName}) => {
        this.effects[type].push(instance[propName].bind(instance));
      });
    }
  }

  runEffects(action: Action) {
    let type = action.type;

    if (isMutationAsAction(action)) {
      type = getNameOfMutation(action.options.mutation);
    }

    const effectsToRun = this.effects[type];

    if (effectsToRun) {
      effectsToRun.forEach(effect => {
        effect(action, this.context);
      });
    }
  }
}

export function mapStates() {
  const names: string[] = [];
  const add = (state: any) => {
    names.push(state.name);
  };

  return {names, add};
}

export function extractState(
  state: StateClass<Metadata>,
  injector: Injector,
): {
  instance: any;
  meta: Metadata;
} {
  return {
    instance: injector.get(state),
    meta: state[METADATA_KEY],
  };
}
