import {ApolloClient, MutationOptions} from 'apollo-client';
import {FetchResult} from 'apollo-link';
import {
  Manager,
  StateClass,
  METADATA_KEY,
  isMutation,
  getMutation,
  isMutationAsAction,
  getNameOfMutation,
  MutationObject,
  buildContext,
  Metadata,
  EffectMethod,
  Action,
  ActionObject,
  EffectContext,
} from '@loona/core';

import {buildGetCacheKey} from './utils';

export class Loona {
  effects: Record<string, Array<EffectMethod>> = {};

  constructor(
    private client: ApolloClient<any>,
    private manager: Manager,
    states: StateClass[],
  ) {
    states.forEach((state: any) => {
      const instance = new state();
      const meta: Metadata = state[METADATA_KEY];

      this.manager.addState(instance, meta);
      this.addEffects(instance, meta.effects);
    });
  }

  dispatch(action: MutationObject | ActionObject): void {
    if (isMutation(action)) {
      const mutation = getMutation(action);
      const config = {
        mutation,
        ...action,
      };

      this.client
        .mutate(this.withUpdates(config))
        .then(result => {
          this.runEffects({
            type: 'mutation',
            options: config,
            ok: true,
            ...result,
          });
        })
        .catch(error => {
          this.runEffects({
            type: 'mutation',
            options: config,
            ok: false,
            error,
          });

          throw error;
        });
    } else {
      this.runEffects({
        type: getActionType(action),
        ...action,
      });
    }
  }

  addEffects(instance: any, meta?: Metadata.Effects): void {
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
    const cache = this.client.cache;
    const context: EffectContext = {
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
      dispatch: this.dispatch.bind(this),
    };

    if (isMutationAsAction(action)) {
      type = getNameOfMutation(action.options.mutation);
    }

    const effectsToRun = this.effects[type];

    if (effectsToRun) {
      effectsToRun.forEach(effect => {
        effect(action, context);
      });
    }
  }

  public withUpdates<T, V>(
    config: MutationOptions<any, V>,
  ): MutationOptions<any, V> {
    const orgUpdate = config.update;

    return {
      ...config,
      update: (proxy, mutationResult: FetchResult<T>) => {
        const name = getNameOfMutation(config.mutation);
        const result: T = mutationResult.data && mutationResult.data[name];
        const cache = this.manager.cache;

        const context = buildContext({
          cache: proxy,
          getCacheKey: buildGetCacheKey(cache),
        });

        const updates = this.manager.updates.get(name);

        if (updates) {
          const info = {
            name,
            variables: config.variables,
            result,
          };

          updates.forEach(def => def.resolve(info, context));
        }

        if (orgUpdate) {
          orgUpdate(proxy, mutationResult);
        }
      },
    };
  }
}

export function getActionType(action: any): string {
  if (action.constructor && action.constructor.type) {
    return action.constructor.type;
  }

  return action.type;
}
