import { Observable } from 'rxjs';

import { setActionMetadata } from '../metadata/action';

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
