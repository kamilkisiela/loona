import {Injectable, OnDestroy} from '@angular/core';
import {Observable, BehaviorSubject, Subject} from 'rxjs';
import {Action} from '@loona/core';

import {INIT} from './tokens';

export class Actions<V = Action> extends Observable<V> {}

@Injectable()
export class ScannedActions extends Subject<Action> implements OnDestroy {
  ngOnDestroy() {
    this.complete();
  }
}

@Injectable()
export class InnerActions extends BehaviorSubject<Action> implements OnDestroy {
  constructor() {
    super({type: INIT});
  }

  next(action: Action) {
    if (typeof action === 'undefined') {
      throw new TypeError(`Actions must be objects`);
    } else if (typeof action.type === 'undefined') {
      throw new TypeError(`Actions must have a type property`);
    }

    super.next(action);
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
