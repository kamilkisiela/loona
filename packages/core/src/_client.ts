/* import {
  ApolloClient,
  WatchQueryOptions,
  ObservableQuery,
} from 'apollo-client';
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link';
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

export class Client {
  private mutationManager: MutationManager;
  private queryManager: QueryManager;
  private cache: ApolloCache<any>;
  private apolloClient?: ApolloClient<any>;

  constructor(private options: Options) {
    this.mutationManager = new MutationManager(options.mutations);
    this.queryManager = new QueryManager(options.queries);
    this.cache = options.cache;
  }

  createLink(): ApolloLink {
    return withClientState({
      cache: this.cache,
      resolvers: {
        // TODO: there's need to be a place for Type resolvers
        Query: createQuerySchema(this.queryManager),
        Mutation: createMutationSchema(
          this.mutationManager,
          this.options.updates,
        ),
      },
      defaults: this.options.defaults,
      typeDefs: this.options.typeDefs,
    });
  }

  use(apolloClient: ApolloClient<any>) {
    this.apolloClient = apolloClient;
  }

  query<T = any>(options: WatchQueryOptions): ObservableQuery<T> {
    if (!this.apolloClient) {
      throw new Error('No ApolloClient');
    }
    return this.apolloClient.watchQuery<T>(options);
  }

  mutate<V = Record<string, any>>(name: string, variables?: V) {
    if (!this.apolloClient) {
      throw new Error('No ApolloClient');
    }

    this.apolloClient.mutate({
      mutation: this.mutationManager.get(name).mutation,
      variables,
    });
  }

  dispatch(name: string, payload: Record<string, any>) {
    console.log('Actions are not yet supported');
    console.log('You tried to call', name, 'with', payload);
  }
}

// export function create(options: Options): API {
//   const mutationManager = new MutationManager(options.mutations);
//   const queryManager = new QueryManager(options.queries);

//   const cache = options.cache;

//   const link = withClientState({
//     cache,
//     resolvers: {
//       // TODO: there's need to be a place for Type resolvers
//       Query: createQuerySchema(queryManager),
//       Mutation: createMutationSchema(mutationManager, options.updates),
//     },
//     defaults: options.defaults,
//     typeDefs: options.typeDefs,
//   });

//   const client = new ApolloClient({
//     cache,
//     link,
//   });

//   return {
//     query(opts) {
//       return client.watchQuery(opts);
//     },
//     mutate(name, variables) {
//       client.mutate({
//         mutation: mutationManager.get(name).mutation,
//         variables,
//       });
//     },
//     dispatch(name, payload) {
//       console.log('Actions are not yet supported');
//       console.log('You tried to call', name, 'with', payload);
//     },
//   };
// }
*/
