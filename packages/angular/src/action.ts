import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ensureMetadata } from './metadata';

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

export function Action(actions: any | any[], options?: any) {
  return function(
    target: any,
    name: string,
    _descriptor: TypedPropertyDescriptor<
      (action: any, action$: Observable<any>) => Observable<any> | Promise<any>
    >,
  ) {
    setActionMetadata(
      target,
      name,
      Array.isArray(actions) ? actions : [actions],
      options,
    );
  };
}

function setActionMetadata(
  proto: any,
  propName: string,
  actions: any[],
  options?: any,
) {
  const constructor = proto.constructor;
  const meta = ensureMetadata(constructor);

  for (const action of actions) {
    const type = action.type;

    if (!action.type) {
      throw new Error(
        `Action ${(action as any).name} is missing a static "type" property`,
      );
    }

    if (!meta.actions[type]) {
      meta.actions[type] = [];
    }

    meta.actions[type].push({
      propName,
      options: options || {},
      type,
    });
  }
}

export function getActionType(action: any): string {
  if (action.constructor && action.constructor.type) {
    return action.constructor.type;
  }

  return action.type;
}
