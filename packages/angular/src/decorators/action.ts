import {setActionMetadata} from '../metadata/action';
import {ActionMethod, ActionDef} from '../types/action';

export function Action(actions: ActionDef | ActionDef[], options?: any) {
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
