import {DocumentNode} from 'graphql';

import {setMutationMetadata} from '../metadata/mutation';
import {getMutation} from '../mutation';
import {MutationMethod, MutationObject} from '../types/mutation';

export function Mutation(
  mutation: MutationObject | DocumentNode | string,
  options?: any,
) {
  return function(
    target: any,
    name: string,
    _descriptor: TypedPropertyDescriptor<MutationMethod>,
  ) {
    setMutationMetadata(
      target,
      name,
      getMutation(mutation) || (mutation as string),
      options,
    );
  };
}
