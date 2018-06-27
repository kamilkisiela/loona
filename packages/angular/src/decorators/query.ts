import {setQueryMetadata} from '../metadata/query';

export function Query() {
  return function(
    target: any,
    name: string,
    _descriptor: TypedPropertyDescriptor<any>,
  ) {
    setQueryMetadata(target, name);
  };
}
