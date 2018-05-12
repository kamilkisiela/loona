import { Injectable, OnDestroy, Provider } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Mutation } from './models';

export const INIT = 'apollo-flux/init';

@Injectable()
export class MutationsSubject extends BehaviorSubject<Mutation>
  implements OnDestroy {
  constructor() {
    super({ name: INIT });
  }

  next(mutation: Mutation): void {
    if (typeof mutation === 'undefined') {
      throw new TypeError(`Mutation must be objects`);
    } else if (typeof mutation.name === 'undefined') {
      throw new TypeError(`Mutation must have a name property`);
    }

    super.next(mutation);
  }

  complete() {
    /* noop */
  }

  ngOnDestroy() {
    super.complete();
  }
}

export const MUTATIONS_SUBJECT_PROVIDERS: Provider[] = [MutationsSubject];
