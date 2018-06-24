import { DocumentNode } from 'graphql';

import { setMutationMetadata } from '../metadata/mutation';
import { isMutation } from '../internal/mutation';

export function Mutation(mutation: DocumentNode | any, options?: any) {
  return function(
    target: any,
    name: string,
    _descriptor: TypedPropertyDescriptor<any>,
  ) {
    const isClass = isMutation(mutation);

    setMutationMetadata(
      target,
      name,
      isClass ? mutation.mutation : mutation,
      isClass,
      options,
    );
  };
}
