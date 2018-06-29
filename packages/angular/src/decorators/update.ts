import {UpdateMatchFn} from '@loona/core';

import {setUpdateMetadata} from '../metadata/update';

export function Update(match: UpdateMatchFn) {
  return function(
    target: any,
    name: string,
    _descriptor: TypedPropertyDescriptor<any>,
  ) {
    setUpdateMetadata(target, name, match);
  };
}
