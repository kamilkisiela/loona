import { Injectable, OnDestroy, Inject, Provider } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { groupBy, mergeMap, exhaustMap, dematerialize } from 'rxjs/operators';
import omit from 'lodash.omit';

import { UpdateFn } from './models';
import { MutationsSubject } from './mutations-subject';
import { INITIAL_UPDATES } from './tokens';

export abstract class UpdateObservable extends Observable<UpdateFn[]> {}
export const UPDATE = 'apollo-flux/update-updates';

@Injectable()
export class UpdateManager extends BehaviorSubject<UpdateFn[]>
  implements OnDestroy {
  constructor(@Inject(INITIAL_UPDATES) private updates: UpdateFn[]) {
    super(updates);
  }

  addUpdate(update: UpdateFn) {
    this.next([...this.updates, update]);
  }

  ngOnDestroy() {
    this.complete();
  }
}

export const UPDATE_MANAGER_PROVIDERS: Provider[] = [
  UpdateManager,
  { provide: UpdateObservable, useExisting: UpdateManager },
];
