import {DocumentNode} from 'graphql';

import {setMutationMetadata} from '../metadata/mutation';
import {isMutation} from '../internal/mutation';
import {MutationMethod} from '../types/mutation';

export function Mutation(mutation: DocumentNode | any, options?: any) {
  return function(
    target: any,
    name: string,
    _descriptor: TypedPropertyDescriptor<MutationMethod>,
  ) {
    setMutationMetadata(
      target,
      name,
      isMutation(mutation) ? mutation.mutation : mutation,
      options,
    );
  };
}
