import {
  ApolloClient,
  ApolloQueryResult,
  WatchQueryOptions,
} from 'apollo-client';
import { withClientState } from 'apollo-link-state';
import { Observable } from 'apollo-link';
import { ApolloCache } from 'apollo-cache';
import { MutationDef, UpdateDef, QueryDef } from './types';
import { createQuerySchema, QueryManager } from './query';
import { createMutationSchema, MutationManager } from './mutation';

export interface Options {
  cache: ApolloCache<any>;
  typeDefs: string | string[];
  defaults?: Record<string, any>;
  mutations?: MutationDef[];
  queries?: QueryDef[];
  updates?: UpdateDef[];
}

export interface API {
  query: <T = any>(
    options: WatchQueryOptions,
  ) => Observable<ApolloQueryResult<T>>;
  mutate: (name: string, variables?: Record<string, any>) => void;
  dispatch: (name: string, payload: Record<string, any>) => void;
}

export function create(options: Options): API {
  const mutationManager = new MutationManager(options.mutations);
  const queryManager = new QueryManager(options.queries);

  const cache = options.cache;

  const link = withClientState({
    cache,
    resolvers: {
      // TODO: there's need to be a place for Type resolvers
      Query: createQuerySchema(queryManager),
      Mutation: createMutationSchema(mutationManager, options.updates),
    },
    defaults: options.defaults,
    typeDefs: options.typeDefs,
  });

  const client = new ApolloClient({
    cache,
    link,
  });

  return {
    query(opts) {
      return client.watchQuery(opts);
    },
    mutate(name, variables) {
      client.mutate({
        mutation: mutationManager.get(name).mutation,
        variables,
      });
    },
    dispatch(name, payload) {
      console.log('Actions are not yet supported');
      console.log('You tried to call', name, 'with', payload);
    },
  };
}
