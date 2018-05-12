import { Injectable, OnDestroy, Inject, Provider } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import omit from 'lodash.omit';

import { MutationDef, MutationDefMap } from './models';
import { MutationsSubject } from './mutations-subject';
import { INITIAL_MUTATIONS, INITIAL_UPDATES } from './tokens';

export abstract class MutationObservable extends Observable<MutationDefMap> {}
export abstract class MutationManagerDispatcher extends MutationsSubject {}

export const UPDATE = 'apollo-flux/update-mutations';

@Injectable()
export class MutationManager extends BehaviorSubject<MutationDefMap>
  implements OnDestroy {
  constructor(
    @Inject(INITIAL_MUTATIONS) private mutations: MutationDefMap,
    private dispatcher: MutationManagerDispatcher,
  ) {
    super(mutations);
  }

  addMutation(mutation: MutationDef) {
    this.mutations = { ...this.mutations, [mutation.name]: mutation };

    this.updateMutations(mutation.name);
  }

  removeMutation(name: string) {
    this.mutations = omit(this.mutations, name);

    this.updateMutations(name);
  }

  private updateMutations(name: string) {
    this.next(this.mutations);

    this.dispatcher.next({
      name: UPDATE,
    });
  }

  ngOnDestroy() {
    this.complete();
  }
}

export const MUTATION_MANAGER_PROVIDERS: Provider[] = [
  MutationManager,
  { provide: MutationObservable, useExisting: MutationManager },
  { provide: MutationManagerDispatcher, useExisting: MutationsSubject },
];
