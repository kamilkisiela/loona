import {ApolloClient, MutationOptions} from 'apollo-client';
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
  withUpdates,
  buildGetCacheKey,
  getActionType,
  buildActionFromResult,
  buildActionFromError,
} from '@loona/core';
import {FetchResult} from 'apollo-link';

export class Loona {
  effects: Record<string, Array<EffectMethod>> = {};

  constructor(
    private client: ApolloClient<any>,
    public manager: Manager,
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

      this.wrapMutation(
        this.client.mutate(withUpdates(config, this.manager)),
        config,
      );
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
        getCacheKey: buildGetCacheKey(cache),
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

  public wrapMutation<T>(
    mutationPromise: Promise<FetchResult<T>>,
    config: MutationOptions<T, any>,
    shouldThrow = true,
  ): void {
    mutationPromise
      .then(result => {
        this.runEffects(buildActionFromResult(config, result));
      })
      .catch(error => {
        this.runEffects(buildActionFromError(config, error));

        if (shouldThrow) {
          throw error;
        }
      });
  }
}
