import { DataProxy } from 'apollo-cache';

export function write<T = any, A = any>(fn: (args: A) => T) {
  return (_root, args: A, context) => {
    const cache: DataProxy = context.cache;
    const data = fn(args);

    cache.writeData<T>({ data });

    return null;
  };
}
