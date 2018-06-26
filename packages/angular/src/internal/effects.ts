import { Injectable, Inject, Injector } from '@angular/core';
import { Observable, forkJoin, from, of, throwError } from 'rxjs';
import { mergeMap, first } from 'rxjs/operators';

import { Actions, getActionType } from '../actions';
import { Loona } from '../client';
import { INITIAL_STATE } from '../tokens';
import { StateClass } from '../types/state';
import { METADATA_KEY } from '../metadata/metadata';
import { isPromise, isObservable } from './utils';
import { isMutation } from '../internal/mutation';

@Injectable()
export class Effects {
  private states: any[] = [];

  constructor(
    private loona: Loona,
    private actions$: Actions,
    private injector: Injector,
    @Inject(INITIAL_STATE) private initialStates: StateClass[],
  ) {}

  start() {
    this.states = this.initialStates.map(state => {
      const instance = this.injector.get(state);
      const meta = state[METADATA_KEY];

      return {
        actions: meta.actions,
        instance,
      };
    });

    this.actions$
      .pipe(
        mergeMap(action => this.invokeActions(this.actions$, action)),
        mergeMap(actions => of(...actions)),
      )
      .subscribe(action => {
        if (action && (getActionType(action) || isMutation(action))) {
          this.loona.dispatch(action);
        }
      });
  }

  private invokeActions(
    actions$: Observable<any>,
    action: any,
  ): Observable<any[]> {
    const results = [];

    for (const metadata of this.states) {
      const type = getActionType(action);
      const actionMetadatas = metadata.actions[type];

      if (actionMetadatas) {
        for (const meta of actionMetadatas) {
          try {
            let result = metadata.instance[meta.propName].call(
              metadata.instance,
              action,
              actions$,
            );

            if (isPromise(result)) {
              result = from(result);
            }

            if (isObservable(result)) {
              results.push(result.pipe(first()));
            }
          } catch (e) {
            results.push(throwError(e));
          }
        }
      }
    }

    if (!results.length) {
      results.push(of({}));
    }

    return forkJoin(results);
  }
}
