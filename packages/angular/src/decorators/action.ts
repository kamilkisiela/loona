import {setActionMetadata} from '../metadata/action';
import {ActionMethod} from '../types/action';

export function Action(actions: any | any[], options?: any) {
  return function(
    target: any,
    name: string,
    _descriptor: TypedPropertyDescriptor<ActionMethod>,
  ) {
    setActionMetadata(
      target,
      name,
      Array.isArray(actions) ? actions : [actions],
      options,
    );
  };
}
