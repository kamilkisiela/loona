import {setUpdateMetadata} from '../metadata/update';
import {getNameOfMutation, getMutation, isMutation} from '../mutation';
import {UpdateMethod, UpdateMatchFn} from '../types/update';
import {MutationObject} from '../types/mutation';
import {DocumentNode} from 'graphql';

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

    const match: UpdateMatchFn = info => info.name === mutationName;

    setUpdateMetadata(target, name, match);
  };
}
