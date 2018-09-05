import {setUpdateMetadata} from '../metadata/update';
import {getNameOfMutation, getMutation} from '../mutation';
import {UpdateMethod, UpdateMatchFn} from '../types/update';

export function Update(mutation: any) {
  return function(
    target: any,
    name: string,
    _descriptor: TypedPropertyDescriptor<UpdateMethod>,
  ) {
    const document = getMutation(mutation);

    if (!document) {
      throw new Error(
        `Mutation ${
          (mutation as any).name
        } is missing a static property 'mutation'`,
      );
    }
    const mutationName = getNameOfMutation(document);
    const match: UpdateMatchFn = info => info.name === mutationName;

    setUpdateMetadata(target, name, match);
  };
}
