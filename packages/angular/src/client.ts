import {Injectable} from '@angular/core';
import {Apollo, QueryRef} from 'apollo-angular';
import {
  WatchQueryOptions,
  MutationOptions as CoreMutationOptions,
} from 'apollo-client';
import {FetchResult} from 'apollo-link';
import {Observable, Subject, queueScheduler, of, merge} from 'rxjs';
import {observeOn, mergeMap, mapTo, tap} from 'rxjs/operators';
import {DocumentNode} from 'graphql';

import {isMutation, getMutation, mutationToType} from './internal/mutation';
import {Actions} from './actions';
import {Dispatcher} from './internal/dispatcher';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface QueryOptions
  extends Omit<WatchQueryOptions, 'query' | 'variables'> {}

export interface MutationOptions
  extends Omit<CoreMutationOptions, 'mutation' | 'variables'> {}

export type R = Record<string, any>;

@Injectable()
export class Loona {
  private queue$: Observable<any>;
  private direct$ = new Subject<any>();

  constructor(
    private apollo: Apollo,
    private dispatcher: Dispatcher,
    actions: Actions,
  ) {
    const dispatched$ = this.dispatcher.pipe(
      observeOn(queueScheduler),
      mergeMap(action => {
        if (isMutation(action)) {
          const mutation = getMutation(action);

          action.type = mutationToType(action);

          return apollo
            .mutate({
              ...action,
              mutation,
            })
            .pipe(mapTo(action));
        }

        return of(action);
      }),
    );
    this.queue$ = merge(dispatched$, this.direct$);
    this.queue$.subscribe(actions);
  }

  query<T, V = any>(
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

  mutate<T, V = R>(
    mutation: DocumentNode,
    variables?: V,
    options?: MutationOptions,
  ): Observable<FetchResult<T>> {
    return this.apollo
      .mutate<T, V>({
        mutation,
        variables,
        ...options,
      })
      .pipe(
        tap(() => {
          this.direct$.next({
            mutation,
            variables,
          });
        }),
      );
  }

  dispatch(action: any): void {
    this.dispatcher.next(action);
  }
}
