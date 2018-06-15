import { OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MutationDef, getNameOfMutation, UpdateDef } from '@apollo-flux/core';

import { ensureMetadata, Metadata } from './metadata';
import { createResolver } from './utils';

export function Update(options?: any) {
  return function(
    target: any,
    name: string,
    _descriptor: TypedPropertyDescriptor<any>,
  ) {
    setUpdateMetadata(target, name, options);
  } as any;
}

function setUpdateMetadata(proto: any, propName: string, options?: any) {
  const constructor = proto.constructor;
  const meta = ensureMetadata(constructor);

  meta.updates.push({ propName, options });
}

export function ofName<T extends MutationDef>(
  name: string,
): OperatorFunction<MutationDef, T> {
  return filter(
    (mutation: MutationDef): mutation is T =>
      getNameOfMutation(mutation.mutation) === name,
  );
}

export function transformUpdates(instance: any, meta: Metadata): UpdateDef[] {
  return meta.updates.map(({ propName, options }) => ({
    ...options,
    resolve: createResolver(instance, propName),
  }));
}
