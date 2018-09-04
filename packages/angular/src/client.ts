import {Injectable} from '@angular/core';
import {Apollo, QueryRef} from 'apollo-angular';
import {
  WatchQueryOptions,
  MutationOptions as CoreMutationOptions,
} from 'apollo-client';
import {Observable, queueScheduler, of} from 'rxjs';
import {observeOn, mergeMap, mapTo} from 'rxjs/operators';
import {DocumentNode} from 'graphql';

import {isMutation, getMutation, mutationToType} from './internal/mutation';
import {Actions} from './actions';
import {Dispatcher} from './internal/dispatcher';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface QueryOptions
  extends Omit<WatchQueryOptions, 'query' | 'variables'> {}

export interface MutationOptions
  extends Omit<CoreMutationOptions, 'mutation' | 'variables'> {}

@Injectable()
export class Loona {
  private queue$: Observable<any>;

  constructor(
    private apollo: Apollo,
    private dispatcher: Dispatcher,
    actions: Actions,
  ) {
    this.queue$ = this.dispatcher.pipe(
      observeOn(queueScheduler),
      mergeMap(action => {
        if (isMutation(action)) {
          const mutation = getMutation(action);

          action.type = mutationToType(action);

          return apollo
            .mutate({
              mutation,
              variables: action.variables,
            })
            .pipe(mapTo(action));
        }

        return of(action);
      }),
    );

    this.queue$.subscribe(actions);
  }

  query<T = {}, V = any>(
    query: DocumentNode,
    variables?: V,
    options?: QueryOptions,
  ): QueryRef<T, V> {
    return this.apollo.watchQuery<T, V>({
      query,
      variables,
      ...options,
    });
  }

  mutate(mutation: DocumentNode, variables?: any, options?: MutationOptions) {
    return this.dispatcher.next({
      mutation,
      variables,
      ...options,
    });
  }

  dispatch(action: any): void {
    this.dispatcher.next(action);
  }
}
