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
import {createResolvers} from './internal/resolvers';
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
      this.manager = new Manager(optionsOrManager);
    }

    this.stateLink = withClientState({
      cache: this.manager.cache,
      resolvers: () => {
        return {
          Mutation: createMutationSchema(this.manager),
          ...createResolvers(this.manager),
        };
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
