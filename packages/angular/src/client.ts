import {Injectable, ErrorHandler} from '@angular/core';
import {Apollo, QueryRef} from 'apollo-angular';
import {
  WatchQueryOptions,
  MutationOptions as CoreMutationOptions,
} from 'apollo-client';
import {FetchResult} from 'apollo-link';
import {Observable, Subject, queueScheduler, merge, throwError} from 'rxjs';
import {observeOn, tap, catchError} from 'rxjs/operators';
import {DocumentNode} from 'graphql';
import {isMutation, getMutation, Action, isDocument} from '@loona/core';

import {InnerActions, ScannedActions, getActionType} from './actions';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface QueryOptions
  extends Omit<WatchQueryOptions, 'query' | 'variables'> {}

export interface MutationOptions
  extends Omit<CoreMutationOptions, 'mutation' | 'variables'> {}

export type R = Record<string, any>;

export interface TypedVariables<V> {
  variables?: V;
}

@Injectable()
export class Loona {
  private queue$: Observable<Action>;
  private direct$ = new Subject<Action>();

  constructor(
    private apollo: Apollo,
    private actions: InnerActions,
    scannedActions: ScannedActions,
    errorHandler: ErrorHandler,
  ) {
    this.queue$ = merge(actions, this.direct$).pipe(observeOn(queueScheduler));
    this.queue$.subscribe({
      next: action => {
        scannedActions.next(action);
      },
      error: error => {
        errorHandler.handleError(error);
      },
    });
  }

  query<T, V = any>(
    query: DocumentNode,
    variables?: V,
    options?: QueryOptions,
  ): QueryRef<T, V>;
  query<T, V = any>(
    options: WatchQueryOptions & TypedVariables<V>,
  ): QueryRef<T, V>;
  query<T, V = any>(
    queryOrOptions: DocumentNode | (WatchQueryOptions & TypedVariables<V>),
    variables?: V,
    options?: QueryOptions,
  ): QueryRef<T, V> {
    return this.apollo.watchQuery<T, V>(
      isDocument(queryOrOptions)
        ? {
            query: queryOrOptions,
            variables,
            ...options,
          }
        : queryOrOptions,
    );
  }

  mutate<T, V = R>(
    mutation: DocumentNode,
    variables?: V,
    options?: MutationOptions,
  ): Observable<FetchResult<T>>;
  mutate<T, V = R>(
    options: CoreMutationOptions<T, V>,
  ): Observable<FetchResult<T>>;
  mutate<T, V = R>(
    mutationOrOptions: DocumentNode | CoreMutationOptions<T, V>,
    variables?: V,
    options?: MutationOptions,
  ): Observable<FetchResult<T>> {
    const config = isDocument(mutationOrOptions)
      ? {
          mutation: mutationOrOptions,
          variables,
          ...options,
        }
      : mutationOrOptions;

    // TODO: make Updates to be ran with a non client-side mutation
    return this.apollo.mutate<T, V>(config).pipe(
      tap(result => {
        this.direct$.next({
          type: 'mutation',
          options: config,
          ok: true,
          ...result,
        });
      }),
      catchError(error => {
        this.direct$.next({
          type: 'mutation',
          options: config,
          ok: false,
          ...error,
        });
        return throwError(error);
      }),
    );
  }

  dispatch(action: any): void {
    if (isMutation(action)) {
      const mutation = getMutation(action);

      this.mutate({
        mutation,
        ...action,
      }).subscribe();
    } else {
      this.actions.next({
        type: getActionType(action),
        ...action,
      });
    }
  }
}
