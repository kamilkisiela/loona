import {Injectable, Inject, Injector} from '@angular/core';
import {Observable, forkJoin, from, of, throwError} from 'rxjs';
import {mergeMap, first} from 'rxjs/operators';
import {StateClass, isMutation, isPromise, METADATA_KEY} from '@loona/core';

import {Actions, getActionType} from '../actions';
import {Loona} from '../client';
import {INITIAL_STATE} from '../tokens';
import {isObservable} from './utils';
import {Metadata} from '../types/metadata';

@Injectable()
export class Effects {
  private states: any[] = [];

  constructor(
    private loona: Loona,
    private actions$: Actions,
    private injector: Injector,
    @Inject(INITIAL_STATE) private initialStates: StateClass<Metadata>[],
  ) {}

  start() {
    this.states = this.initialStates.map(state => {
      const instance = this.injector.get(state);
      const meta = state[METADATA_KEY];

      console.log('meta', meta);

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

  add(
    states: {
      actions: any[];
      instance: any;
    }[],
  ) {
    this.states.push(...states);
  }

  private invokeActions(
    actions$: Observable<any>,
    action: any,
  ): Observable<any[]> {
    const results = [];

    for (const state of this.states) {
      console.log('state', state);
      console.log('action', action);
      const type = getActionType(action);
      console.log('type', type);
      const actionMetadatas = state.actions[type];
      console.log('for that type', actionMetadatas);

      if (actionMetadatas) {
        for (const meta of actionMetadatas) {
          try {
            let result = state.instance[meta.propName].call(
              state.instance,
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
