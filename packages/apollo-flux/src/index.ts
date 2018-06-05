import {
  ApolloClient,
  ApolloQueryResult,
  WatchQueryOptions,
} from 'apollo-client';
import { withClientState } from 'apollo-link-state';
import { Observable } from 'apollo-link';
import { ApolloCache } from 'apollo-cache';
import { QueryMap, MutationDef, UpdateDef } from './types';
import { createQuerySchema } from './query';
import { createMutationSchema } from './mutation';

export { ofName, getNameOfMutation } from './utils';

export interface Options {
  cache: ApolloCache<any>;
  typeDefs: string | string[];
  defaults?: Record<string, any>;
  mutations?: MutationDef[];
  queries?: QueryMap;
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
  const cache = options.cache;

  const link = withClientState({
    cache,
    resolvers: {
      // TODO: there's need to be a place for Type resolvers
      Query: createQuerySchema(options.queries),
      Mutation: createMutationSchema(options.mutations, options.updates),
    },
    defaults: options.defaults,
    typeDefs: options.typeDefs,
  });

  const client = new ApolloClient({
    cache,
    link,
  });

  const findMutationByName = (name: string) =>
    options.mutations.find(m => getNameOfMutation(m.mutation) === name);

  return {
    query(opts) {
      return client.watchQuery(opts);
    },
    mutate(name, variables) {
      client.mutate({
        mutation: findMutationByName(name).mutation,
        variables,
      });
    },
    dispatch(name, payload) {
      console.log('Actions are not yet supported');
      console.log('You tried to call', name, 'with', payload);
    },
  };
}
