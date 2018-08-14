import {DocumentNode} from 'graphql';

import {ensureMetadata, readMetadata} from './metadata';

export function setMutationMetadata(
  proto: any,
  propName: string,
  mutation: DocumentNode,
  options?: any,
) {
  const constructor = proto.constructor;
  const meta = ensureMetadata(constructor);

  meta.mutations.push({
    propName,
    mutation,
    options,
  });
}

export function hasMutation(target: any, propName: string): boolean {
  const meta = readMetadata(target);

  console.log('meta', meta);

  if (meta) {
    return meta.mutations.some(def => {
      console.log('def', def);
      console.log('propName', propName);
      return def.propName === propName;
    });
  }

  return false;
}
