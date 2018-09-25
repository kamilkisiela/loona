import {DocumentNode, GraphQLError} from 'graphql';
import {MutationOptions} from 'apollo-client';
import {FetchResult} from 'apollo-link';

import {MutationDef, MutationObject} from './types/mutation';
import {Store} from './internal/store';
import {getMutationDefinition, getFirstField} from './internal/utils';
import {Manager} from './manager';
import {buildContext, buildGetCacheKey} from './helpers';

export class MutationManager extends Store<MutationDef> {
  constructor(defs?: MutationDef[]) {
    super();

    if (defs) {
      defs.forEach(def => {
        this.set(def.mutation, def);
      });
    }
  }

  add(defs: MutationDef[]): void {
    defs.forEach(def => {
      this.set(def.mutation, def);
    });
  }
}

export function mutationToType(action: MutationObject): string {
  const mutation = getMutation(action);
  const name = getNameOfMutation(mutation);

  return name;
}

export function getMutation(action: any): DocumentNode {
  if (action.constructor && action.constructor.mutation) {
    return action.constructor.mutation;
  }

  return action.mutation;
}

export function isMutation(action: any): action is MutationObject {
  return typeof getMutation(action) !== 'undefined';
}

export function getNameOfMutation(mutation: DocumentNode): string {
  const def = getMutationDefinition(mutation);
  const field = getFirstField(def);

  return field.name.value;
}

export function withUpdates<T, V>(
  config: MutationOptions<any, V>,
  manager: Manager,
): MutationOptions<any, V> {
  const orgUpdate = config.update;

  return {
    ...config,
    update: (proxy, mutationResult: FetchResult<T>) => {
      const name = getNameOfMutation(config.mutation);
      const result: T = mutationResult.data && mutationResult.data[name];
      const cache = manager.cache;

      const context = buildContext(
        {
          cache: proxy,
          getCacheKey: buildGetCacheKey(cache),
        },
        manager.getClient(),
      );

      const updates = manager.updates.get(name);

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

export function buildActionFromResult<T, V>(
  config: MutationOptions<T, V>,
  result: FetchResult<T>,
): {
  type: string;
  options: MutationOptions<T, V>;
  ok: boolean;
  errors?: ReadonlyArray<GraphQLError>;
  data?: T | {[key: string]: any};
  extensions?: Record<string, any>;
  context?: any;
} {
  return {
    type: 'mutation',
    options: config,
    ok: true,
    ...result,
  };
}

export function buildActionFromError<T, V>(
  config: MutationOptions<T, V>,
  error: any,
) {
  return {
    type: 'mutation',
    options: config,
    ok: false,
    error,
  };
}
