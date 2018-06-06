import {
  ApolloLink,
  Operation,
  NextLink,
  Observable,
  FetchResult,
} from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { ApolloCache } from 'apollo-cache';

import { createMutationSchema, MutationManager } from './mutation';
import { createQuerySchema, QueryManager } from './query';
import { MutationDef, QueryDef, UpdateDef } from './types';

export class FluxLink extends ApolloLink {
  public queryManager: QueryManager;
  public mutationManager: MutationManager;
  private cache: ApolloCache<any>;
  private stateLink: ApolloLink;

  constructor(options: {
    cache: ApolloCache<any>;
    mutations?: MutationDef[];
    queries?: QueryDef[];
    updates?: UpdateDef[];
    defaults?: any;
    resolvers?: any;
    typeDefs?: string | string[];
  }) {
    super();

    this.cache = options.cache;
    this.queryManager = new QueryManager(options.queries);
    this.mutationManager = new MutationManager(options.mutations);

    this.stateLink = withClientState({
      cache: this.cache,
      // TODO: make it as a function
      resolvers: {
        // TODO: there's need to be a place for Type resolvers
        Query: createQuerySchema(this.queryManager),
        Mutation: createMutationSchema(this.mutationManager, options.updates),
        ...options.resolvers,
      },
      defaults: options.defaults,
      typeDefs: options.typeDefs,
    });
  }

  public request(
    operation: Operation,
    forward: NextLink,
  ): Observable<FetchResult> {
    return this.stateLink.request(operation, forward) as Observable<
      FetchResult
    >;
  }
}
