import {ApolloClient} from 'apollo-client';
import {
  Manager,
  StateClass,
  MutationDef,
  ResolverDef,
  UpdateDef,
  METADATA_KEY,
  transformMutations,
  transformResolvers,
  transformUpdates,
  isString,
  isMutation,
  getMutation,
  mutationToType,
  MutationObject,
  buildContext,
} from '@loona/core';

import {Metadata, ActionMethod, ActionObject, ActionContext} from './types';
import {getActionType} from './actions';

export class Loona {
  states: any[] = [];
  actions: Record<string, ActionMethod<any>[]> = [] as any;

  constructor(
    private client: ApolloClient<any>,
    manager: Manager,
    states: StateClass[],
  ) {
    let mutations: MutationDef[] = [];
    let resolvers: ResolverDef[] = [];
    let updates: UpdateDef[] = [];
    let defaults: any = {};
    let typeDefs: Array<string> = [];

    states.forEach((state: any) => {
      const instance = new state();
      const meta: Metadata = state[METADATA_KEY];

      mutations = mutations.concat(transformMutations(instance, meta));
      updates = updates.concat(transformUpdates(instance, meta) || []);
      resolvers = resolvers.concat(transformResolvers(instance, meta) || []);
      defaults = {
        ...defaults,
        ...meta.defaults,
      };

      // actions
      if (meta.actions) {
        for (const type in meta.actions) {
          if (!this.actions[type]) {
            this.actions[type] = [];
          }

          meta.actions[type].forEach(({propName}) => {
            this.actions[type].push(instance[propName].bind(instance));
          });
        }
      }

      if (meta.typeDefs) {
        typeDefs.push(
          ...(isString(meta.typeDefs) ? [meta.typeDefs] : meta.typeDefs),
        );
      }
    });

    // add mutations
    manager.mutations.add(mutations);
    // add updates
    manager.updates.add(updates);
    // add resolvers
    manager.resolvers.add(resolvers);
    // write defaults
    manager.cache.writeData({
      data: defaults,
    });

    if (typeDefs) {
      if (isString(manager.typeDefs)) {
        manager.typeDefs = [manager.typeDefs];
      }

      if (!manager.typeDefs) {
        manager.typeDefs = [];
      }

      manager.typeDefs.push(...typeDefs);
    }
  }

  dispatch(
    action: MutationObject | ActionObject | ActionMethod<any>,
    execute = true,
  ): void {
    if (isMutation(action) && execute) {
      const mutation = getMutation(action);

      (action as any).type = mutationToType(action);

      this.runMiddlewares(action as any);

      // TODO: how to handle a failure? (not in life, here)
      // this.client
      //   .mutate({
      //     ...action,
      //     mutation,
      //   })
      //   .then(() => {
      //     this.runMiddlewares(action as any);
      //   });
      const result = this.client.mutate({
        ...action,
        mutation,
      });

      this.runMiddlewares(result);
    } else {
      if (isMutation(action)) {
        (action as any).type = mutationToType(action);
      }

      this.runMiddlewares(action as any);
    }
  }

  async runMiddlewares(action: ActionObject | ActionMethod<any>) {
    const type = getActionType(action);
    const middlewares = this.actions[type];
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

    if (middlewares) {
      for (const middleware of middlewares) {
        const queued = await middleware(action, context);

        if (queued) {
          if (Array.isArray(queued)) {
            queued.forEach(to => this.dispatch(to));
          }
          this.dispatch(queued);
        }
      }
    }
  }
}
