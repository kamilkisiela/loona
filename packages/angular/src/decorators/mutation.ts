import {DocumentNode} from 'graphql';

import {setMutationMetadata} from '../metadata/mutation';
import {isMutation} from '../internal/mutation';

export function Mutation(mutation: DocumentNode | any, options?: any) {
  return function(
    target: any,
    name: string,
    _descriptor: TypedPropertyDescriptor<any>,
  ) {
    console.log('Mutation: set metadata');
    setMutationMetadata(
      target,
      name,
      isMutation(mutation) ? mutation.mutation : mutation,
      options,
    );
  };
}
