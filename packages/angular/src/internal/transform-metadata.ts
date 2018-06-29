import {MutationDef, QueryDef, UpdateDef} from '@loona/core';

import {Metadata} from '../types/metadata';
import {createResolver} from './utils';

export function transformMutations(
  instance: any,
  meta: Metadata,
): MutationDef[] {
  return meta.mutations.map(({propName, mutation, options}) => ({
    mutation: mutation || options.mutation,
    resolve: createResolver(instance, propName),
  }));
}

export function transformUpdates(
  instance: any,
  meta: Metadata,
): UpdateDef[] | undefined {
  if (meta.updates) {
    return meta.updates.map(({propName, match}) => ({
      match,
      resolve: instance[propName].bind(instance),
    }));
  }
}

export function transformQueries(instance: any, meta: Metadata): QueryDef[] {
  return meta.queries.map(({propName}) => ({
    name: propName,
    resolve: createResolver(instance, propName),
  }));
}
