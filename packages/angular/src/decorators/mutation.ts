import { setMutationMetadata } from '../metadata/mutation';

export function Mutation(options?: any) {
  return function(
    target: any,
    name: string,
    _descriptor: TypedPropertyDescriptor<any>,
  ) {
    setMutationMetadata(target, name, options);
  };
}
