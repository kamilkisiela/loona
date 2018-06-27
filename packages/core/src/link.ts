import {
  ApolloLink,
  Operation,
  NextLink,
  Observable,
  FetchResult,
} from 'apollo-link';
import {withClientState} from 'apollo-link-state';

import {Manager} from './manager';
import {createMutationSchema} from './internal/mutation';
import {createQuerySchema} from './internal/query';
import {Options} from './types/options';

function isManager(obj: any): obj is Manager {
  return obj instanceof Manager;
}

export class LoonaLink extends ApolloLink {
  public manager: Manager;
  private stateLink: ApolloLink;

  constructor(optionsOrManager: Options | Manager) {
    super();

    if (isManager(optionsOrManager)) {
      this.manager = optionsOrManager;
    } else {
      this.manager = new Manager({
        cache: optionsOrManager.cache,
        typeDefs: optionsOrManager.typeDefs,
        defaults: optionsOrManager.defaults,
        queries: optionsOrManager.queries,
        mutations: optionsOrManager.mutations,
        resolvers: optionsOrManager.resolvers,
      });
    }

    this.stateLink = withClientState({
      cache: this.manager.cache,
      // TODO: make it as a function
      resolvers: {
        // TODO: there's need to be a place for Type resolvers
        Query: createQuerySchema(this.manager.queries),
        Mutation: createMutationSchema(this.manager.mutations),
        ...this.manager.resolvers,
      },
      defaults: this.manager.defaults,
      typeDefs: this.manager.typeDefs,
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
