import { DocumentNode } from 'graphql';

import { ensureMetadata } from './metadata';

export function setMutationMetadata(
  proto: any,
  propName: string,
  mutation: DocumentNode,
  isAction: boolean = false,
  options?: any,
) {
  const constructor = proto.constructor;
  const meta = ensureMetadata(constructor);

  meta.mutations.push({
    propName,
    mutation,
    isAction,
    options,
  });
}
