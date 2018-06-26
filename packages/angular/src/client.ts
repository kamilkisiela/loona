import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { WatchQueryOptions } from 'apollo-client';
import { Observable, queueScheduler, of } from 'rxjs';
import { observeOn, mergeMap, mapTo } from 'rxjs/operators';

import { isMutation, getMutation, mutationToType } from './internal/mutation';
import { Actions } from './actions';
import { Dispatcher } from './internal/dispatcher';

@Injectable({
  providedIn: 'root',
})
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

  query<T = {}>(options: WatchQueryOptions): QueryRef<T> {
    return this.apollo.watchQuery<T>(options);
  }

  dispatch(action: any): void {
    this.dispatcher.next(action);
  }
}
