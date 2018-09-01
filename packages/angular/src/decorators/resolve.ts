import {setResolveMetadata} from '../metadata/resolve';
import {ResolveMethod} from '../types/resolve';

export function Resolve(path: string) {
  return function(
    target: any,
    name: string,
    _descriptor: TypedPropertyDescriptor<ResolveMethod>,
  ) {
    setResolveMetadata(target, name, path);
  };
}
