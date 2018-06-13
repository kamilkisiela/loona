import { MutationDef } from '@apollo-flux/core';
import { from } from 'rxjs';
import { first } from 'rxjs/operators';

import { ensureMetadata, Metadata } from './metadata';
import { createResolver } from './utils';

export function Mutation(options?: any) {
  return function(
    target: any,
    name: string,
    _descriptor: TypedPropertyDescriptor<any>,
  ) {
    setMutationMetadata(target, name, options);
  };
}

function setMutationMetadata(proto: any, propName: string, options?: any) {
  const constructor = proto.constructor;
  const meta = ensureMetadata(constructor);

  meta.mutations.push({ propName, options });
}

export function transformMutations(
  instance: any,
  meta: Metadata,
): MutationDef[] {
  return meta.mutations.map(({ propName, options }) => ({
    mutation: options.mutation,
    resolve: createResolver(instance, propName),
  }));
}
