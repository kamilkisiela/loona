import { MutationDef, QueryDef } from '@luna/core';

import { Metadata } from '../types/metadata';
import { createResolver } from './utils';

export function transformMutations(
  instance: any,
  meta: Metadata,
): MutationDef[] {
  return meta.mutations.map(({ propName, options }) => ({
    mutation: options.mutation,
    resolve: createResolver(instance, propName),
  }));
}

export function transformQueries(instance: any, meta: Metadata): QueryDef[] {
  return meta.queries.map(({ propName }) => ({
    name: propName,
    resolve: createResolver(instance, propName),
  }));
}
