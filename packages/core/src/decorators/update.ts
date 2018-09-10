import {DocumentNode} from 'graphql';
import {setUpdateMetadata} from '../metadata/update';
import {getNameOfMutation, getMutation, isMutation} from '../mutation';
import {UpdateMethod} from '../types/update';
import {MutationObject} from '../types/mutation';

export function Update(mutation: MutationObject | DocumentNode | string) {
  return function(
    target: any,
    name: string,
    _descriptor: TypedPropertyDescriptor<UpdateMethod>,
  ) {
    let mutationName: string;

    if (isMutation(mutation)) {
      const document = getMutation(mutation);

      if (!document) {
        throw new Error(
          `Mutation ${
            (mutation as any).name
          } is missing a static property 'mutation'`,
        );
      }

      mutationName = getNameOfMutation(document);
    } else if (typeof mutation === 'string') {
      mutationName = mutation;
    } else {
      mutationName = getNameOfMutation(mutation);
    }

    setUpdateMetadata(target, name, mutationName);
  };
}
