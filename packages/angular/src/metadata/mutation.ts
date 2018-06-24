import { DocumentNode } from 'graphql';

import { ensureMetadata } from './metadata';

export function setMutationMetadata(
  proto: any,
  propName: string,
  mutation: DocumentNode,
  options?: any,
) {
  const constructor = proto.constructor;
  const meta = ensureMetadata(constructor);

  meta.mutations.push({
    propName,
    mutation,
    options,
  });
}
