import {UpdateMatchFn} from '@loona/core';

import {ensureMetadata} from './metadata';

export function setUpdateMetadata(
  proto: any,
  propName: string,
  match: UpdateMatchFn,
) {
  const constructor = proto.constructor;
  const meta = ensureMetadata(constructor);

  meta.updates.push({
    propName,
    match,
  });
}
