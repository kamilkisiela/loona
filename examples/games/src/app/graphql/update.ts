import { DocumentNode } from 'graphql';
import { DataProxy } from 'apollo-cache';
import produce from 'immer';

export function update<T = any, A = any, C = any>(
  query: DocumentNode,
  fn: (val: T, args: A, ctx: C) => void,
) {
  return async (_root, args: A, context: C & { cache: DataProxy }) => {
    const cache: DataProxy = context.cache;
    const previous = cache.readQuery<T>({ query });

    const data = produce<T>(previous, draft => fn(draft, args, context));

    cache.writeQuery({ query, data });

    return null;
  };
}

export function Update<S = any, A = any, C = any>(query: DocumentNode) {
  return (
    _target,
    _propName,
    descriptor: TypedPropertyDescriptor<
      (
        state?: S,
        args?: A,
        context?: C & { cache: DataProxy },
      ) => Promise<S> | S | void
    >,
  ) => {
    const fn = descriptor.value;

    descriptor.value = update<S, A, C>(query, fn);

    return descriptor;
  };
}
