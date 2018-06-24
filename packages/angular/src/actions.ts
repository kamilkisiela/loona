import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const INIT: '@Init' = '@Init';

export class MutationAsAction {
  constructor(public type: string, public variables: any) {}
}

@Injectable()
export class Actions extends BehaviorSubject<any> implements OnDestroy {
  constructor() {
    super({ type: INIT });
  }

  complete() {}

  ngOnDestroy() {
    super.complete();
  }
}

export function getActionType(action: any): string {
  if (action.constructor && action.constructor.type) {
    return action.constructor.type;
  }

  return action.type;
}
