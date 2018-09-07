import {buildContext, getNameOfMutation} from '@loona/core';
import {Injectable, Inject, OnDestroy} from '@angular/core';
import {ApolloCache} from 'apollo-cache';
import {Subscription} from 'rxjs';

import {Loona} from './client';
import {LOONA_CACHE} from './tokens';
import {ScannedActions} from './actions';
import {
  Metadata,
  EffectMethod,
  EffectDef,
  Action,
  ActionContext,
} from './types';
import {isMutationAsAction} from './utils';
import {setEffectMetadata} from './metadata';

export function Effect(effects: EffectDef | EffectDef[], options?: any) {
  return function(
    target: any,
    name: string,
    _descriptor: TypedPropertyDescriptor<EffectMethod>,
  ) {
    setEffectMetadata(
      target,
      name,
      Array.isArray(effects) ? effects : [effects],
      options,
    );
  };
}

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
        console.log('run effects for', action);
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

  addEffects(instance: any, meta: Metadata.Effects) {
    console.log('[effects] add', instance, meta);
    for (const type in meta) {
      console.log('[effects] for type', type);
      if (!this.effects[type]) {
        this.effects[type] = [];
      }

      meta[type].forEach(({propName}) => {
        console.log('[effects] propName', propName);
        this.effects[type].push(instance[propName].bind(instance));
      });
    }
  }

  runEffects(action: Action) {
    let type = action.type;

    if (isMutationAsAction(action)) {
      type = getNameOfMutation(action.options.mutation);
    }

    console.log('picked type', type);

    const effectsToRun = this.effects[type];

    if (effectsToRun) {
      effectsToRun.forEach(effect => {
        effect(action, this.context);
      });
    }
  }
}
