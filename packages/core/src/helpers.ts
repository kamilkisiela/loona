import {DocumentNode} from 'graphql';
import {DataProxy} from 'apollo-cache';
import produce from 'immer';

import {getMutationDefinition, getFirstField} from './internal/utils';

export function updateQuery<S = any, A = any, C = any>(
  query: DocumentNode,
  fn: (val: S, args: A, ctx: C) => S | void,
) {
  return (_root: any, args: A, context: C) => {
    const cache: DataProxy = (context as any).cache;
    const previous = cache.readQuery<S>({query}) as S;

    const data = produce<S>(previous, draft => fn(draft, args, context));

    cache.writeQuery({query, data});

    return null;
  };
}

export function Update<S = any, A = any, C = any>(query: DocumentNode) {
  return (
    _target: any,
    _propName: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const fn = descriptor.value;

    if (fn) {
      descriptor.value = updateQuery<S, A, C>(query, fn);
    }

    return descriptor;
  };
}

export function getNameOfMutation(mutation: DocumentNode): string {
  const def = getMutationDefinition(mutation);
  const field = getFirstField(def);

  return field.name.value;
}
