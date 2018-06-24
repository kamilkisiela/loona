import { DocumentNode } from 'graphql';

import { setMutationMetadata } from '../metadata/mutation';

export function Mutation(mutation: DocumentNode, options?: any) {
  return function(
    target: any,
    name: string,
    _descriptor: TypedPropertyDescriptor<any>,
  ) {
    setMutationMetadata(target, name, mutation, options);
  };
}
