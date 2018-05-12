import { Injectable, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { WatchQueryOptions, MutationOptions } from 'apollo-client';
import { DataProxy } from 'apollo-cache';
import { Subject, of } from 'rxjs';
import { takeUntil, withLatestFrom } from 'rxjs/operators';

import { Mutation, MutationDef, UpdateFn } from './models';
import { MutationsSubject } from './mutations-subject';
import { MutationManager, MutationObservable } from './mutation-manager';
import { UpdateManager, UpdateObservable } from './update-manager';

@Injectable()
export class ApolloFlux implements OnDestroy {
  private ngDestroy$ = new Subject();

  constructor(
    private apollo: Apollo,
    private mutationsObserver: MutationsSubject,
    private mutationManager: MutationManager,
    private mutations$: MutationObservable,
    private updateManager: UpdateManager,
    private updates$: UpdateObservable,
  ) {
    this.mutationsObserver
      .pipe(
        takeUntil(this.ngDestroy$),
        withLatestFrom(this.mutations$, this.updates$),
      )
      .subscribe(([mutation, mutationMap, updates]) => {
        const record = mutationMap[mutation.name];

        if (record) {
          this.apollo
            .mutate({
              ...record.options,
              variables: mutation.variables,
              update: (cache, result) => {
                const update = {
                  name: mutation.name,
                  variables: mutation.variables,
                  cache,
                  result,
                  options: record.options,
                };

                updates.forEach(updateFn => updateFn(update));
              },
            })
            .subscribe();
        }
      });
  }

  query<T>(options: WatchQueryOptions) {
    return this.apollo.watchQuery<T>(options);
  }

  dispatch(mutation: Mutation) {
    this.mutationsObserver.next(mutation);
    return of(true);
  }

  addMutation(mutation: MutationDef) {
    this.mutationManager.addMutation(mutation);
  }

  removeMutation(name: string) {
    this.mutationManager.removeMutation(name);
  }

  addUpdate(update: UpdateFn) {
    this.updateManager.addUpdate(update);
  }

  ngOnDestroy() {
    this.ngDestroy$.next();
    this.ngDestroy$.complete();
  }
}
