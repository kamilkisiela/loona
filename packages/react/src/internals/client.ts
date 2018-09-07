import {ApolloClient} from 'apollo-client';
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
  ActionContext,
} from '@loona/core';

export class Loona {
  states: any[] = [];
  effects: Record<string, Array<EffectMethod>> = {};

  constructor(
    private client: ApolloClient<any>,
    manager: Manager,
    states: StateClass[],
  ) {
    states.forEach((state: any) => {
      const instance = new state();
      const meta: Metadata = state[METADATA_KEY];

      manager.addState(instance, meta);
      this.addEffects(instance, meta.effects);
    });
  }

  dispatch(action: MutationObject | ActionObject): void {
    console.log('[dispatch] action', action);
    if (isMutation(action)) {
      console.log('is mutation?', action);
      const mutation = getMutation(action);
      const config = {
        mutation,
        ...action,
      };

      this.client
        .mutate(config)
        .then(result => {
          this.runEffects({
            type: 'mutation',
            options: config,
            ...result,
          });
        })
        .catch(error => {
          throw error;
        });
    } else {
      this.runEffects(action);
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
    const context: ActionContext = {
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
}
