import {
  buildContext,
  getNameOfMutation,
  isMutationAsAction,
  Metadata,
  EffectMethod,
  Action,
  EffectContext,
  StateClass,
  METADATA_KEY,
  buildGetCacheKey,
} from '@loona/core';
import {Injectable, Inject, OnDestroy, Injector} from '@angular/core';
import {ApolloCache} from 'apollo-cache';
import {Apollo} from 'apollo-angular';
import {Subscription} from 'rxjs';

import {Loona} from './client';
import {LOONA_CACHE} from './tokens';
import {ScannedActions} from './actions';

@Injectable()
export class Effects {
  effects: Record<string, Array<EffectMethod>> = {};
  getContext: () => EffectContext;

  constructor(
    loona: Loona,
    apollo: Apollo,
    @Inject(LOONA_CACHE) cache: ApolloCache<any>,
  ) {
    this.getContext = () => ({
      ...buildContext(
        {
          cache,
          getCacheKey: buildGetCacheKey(cache),
        },
        apollo.getClient(),
      ),
      dispatch: loona.dispatch.bind(loona),
    });
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
        effect(action, this.getContext());
      });
    }
  }
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

export function mapStates() {
  const names: string[] = [];
  const add = (state: any) => {
    names.push(state.constructor && state.constructor.name);
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
