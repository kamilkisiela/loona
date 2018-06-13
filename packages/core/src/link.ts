import {
  ApolloLink,
  Operation,
  NextLink,
  Observable,
  FetchResult,
} from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { ApolloCache } from 'apollo-cache';

import { Manager } from './manager';
import { createMutationSchema } from './mutation';
import { createQuerySchema } from './query';
import { MutationDef, QueryDef, UpdateDef } from './types';

export interface Options {
  cache: ApolloCache<any>;
  mutations?: MutationDef[];
  queries?: QueryDef[];
  updates?: UpdateDef[];
  defaults?: any;
  resolvers?: any;
  typeDefs?: string | string[];
}

export class FluxLink extends ApolloLink implements FluxLink {
  public manager: Manager;
  private cache: ApolloCache<any>;
  private stateLink: ApolloLink;

  constructor(options: Options) {
    super();

    this.cache = options.cache;
    this.manager = new Manager({
      queries: options.queries,
      mutations: options.mutations,
      updates: options.updates,
    });

    this.stateLink = withClientState({
      cache: this.cache,
      // TODO: make it as a function
      resolvers: {
        // TODO: there's need to be a place for Type resolvers
        Query: createQuerySchema(this.manager.queries),
        Mutation: createMutationSchema(
          this.manager.mutations,
          this.manager.updates,
        ),
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
