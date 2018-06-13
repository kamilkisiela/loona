import { QueryDef } from '@apollo-flux/core';

import { createResolver } from './utils';
import { ensureMetadata, Metadata } from './metadata';

export function Query() {
  return function(
    target: any,
    name: string,
    _descriptor: TypedPropertyDescriptor<any>,
  ) {
    setQueryMetadata(target, name);
  };
}

function setQueryMetadata(proto: any, propName: string) {
  const constructor = proto.constructor;
  const meta = ensureMetadata(constructor);

  meta.queries.push({ propName });
}

export function transformQueries(instance: any, meta: Metadata): QueryDef[] {
  return meta.queries.map(({ propName }) => ({
    name: propName,
    resolve: createResolver(instance, propName),
  }));
}
