import {DocumentNode} from 'graphql';

import {ensureMetadata, readMetadata} from './metadata';
import {Metadata} from '../types/metadata';
import {MutationDef, MutationResolveFn} from '../types/mutation';
import {getNameOfMutation} from '../mutation';

export function setMutationMetadata(
  proto: any,
  propName: string,
  mutation: DocumentNode | string,
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

  if (meta) {
    return meta.mutations.some(def => {
      return def.propName === propName;
    });
  }

  return false;
}

export function transformMutations(
  instance: any,
  meta: Metadata,
  transformFn: ((resolver: any) => MutationResolveFn) = resolver => resolver,
): MutationDef[] {
  return meta.mutations.map(({propName, mutation}) => ({
    mutation:
      typeof mutation === 'string' ? mutation : getNameOfMutation(mutation),
    resolve: transformFn(instance[propName].bind(instance)),
  }));
}
