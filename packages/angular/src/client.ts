import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { WatchQueryOptions, MutationOptions } from 'apollo-client';
import { Manager, getNameOfMutation } from '@apollo-flux/core';
import { Observable, queueScheduler, of } from 'rxjs';
import { observeOn, mergeMap, mapTo } from 'rxjs/operators';

import { Actions, MutationAsAction, getActionType } from './action';
import { Dispatcher } from './dispatcher';

@Injectable({
  providedIn: 'root',
})
export class ApolloFlux {
  private queue$: Observable<any>;

  constructor(
    private apollo: Apollo,
    private manager: Manager,
    private actions: Actions,
    private dispatcher: Dispatcher,
  ) {
    this.queue$ = this.dispatcher.pipe(
      observeOn(queueScheduler),
      mergeMap(action => {
        const mutation = this.manager.mutations.get(getActionType(action));

        if (mutation) {
          return apollo
            .mutate({
              mutation: mutation.mutation,
              variables: action,
            })
            .pipe(mapTo(action));
        }

        return of(action);
      }),
    );

    this.queue$.subscribe(actions);
  }

  query<T = {}>(options: WatchQueryOptions): QueryRef<T> {
    return this.apollo.watchQuery<T>(options);
  }

  dispatch(action: any): void {
    this.dispatcher.next(action);
  }

  mutate(options: MutationOptions): void {
    this.apollo
      .mutate(options)
      .pipe(
        mapTo(
          new MutationAsAction(
            getNameOfMutation(options.mutation),
            options.variables,
          ),
        ),
      )
      .subscribe(this.actions);
  }
}
