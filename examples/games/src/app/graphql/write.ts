import { DataProxy } from 'apollo-cache';

export function write<T = any, A = any>(fn: (args: A) => T) {
  return async (_root, args: A, context) => {
    const cache: DataProxy = context.cache;
    const data = fn(args);

    cache.writeData<T>({ data });

    return null;
  };
}

export function Write() {
  return (_target, _propName, descriptor) => {
    const fn = descriptor.value;

    descriptor.value = write(fn);

    return descriptor;
  };
}
