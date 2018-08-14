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
  debugger;
  const def = getMutationDefinition(mutation);
  debugger;
  const field = getFirstField(def);

  return field.name.value;
}

const writeFragment = (obj: any, fragment: DocumentNode, context: any) => {
  const cache = context.cache;

  cache.writeFragment({
    fragment,
    id: context.getCacheKey(obj),
    data: obj,
  });
};

export function WriteFragment(fragment: DocumentNode) {
  return (
    target: any,
    _propName: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const fn = descriptor.value;

    if (fn) {
      descriptor.value = (_: any, args: any, context: any) => {
        const result = fn.call(target, _, args, context);

        writeFragment(result, fragment, context);

        return result;
      };
    }

    return descriptor;
  };
}

const readFragment = (id: string, fragment: DocumentNode, context: any) => {
  const cache = context.cache;

  return cache.readFragment({
    fragment,
    id, // based on fragment's type and id
  });
};

export function UpdateFragment(
  fragment: DocumentNode,
  getId: (args: any) => string = (args: any) => args.id,
) {
  return (
    target: any,
    _propName: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const fn = descriptor.value;

    if (fn) {
      descriptor.value = (_: any, args: any, context: any) => {
        const id = getId(args);

        const obj = readFragment(id, fragment, context);

        const data = produce(obj, draft =>
          fn.call(target, draft, args, context),
        );

        writeFragment(data, fragment, context);

        return data;
      };
    }

    return descriptor;
  };
}

const writeQuery = (obj: any, context: any) => {
  const cache = context.cache;

  cache.writeData({
    data: obj,
  });
};

export function WriteQuery() {
  return (
    target: any,
    _propName: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const fn = descriptor.value;

    if (fn) {
      descriptor.value = (info: any, context: any) => {
        const result = fn.call(target, info, context);

        writeQuery(result, context);

        return result;
      };
    }

    return descriptor;
  };
}

const readQuery = (query: DocumentNode, context: any) => {
  const cache = context.cache;

  return cache.readQuery({
    query,
  });
};

export function UpdateQuery(query: DocumentNode) {
  return (
    target: any,
    _propName: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const fn = descriptor.value;

    if (fn) {
      descriptor.value = (info: any, context: any) => {
        const obj = readQuery(query, context);

        const data = produce(obj, draft =>
          fn.call(target, draft, info, context),
        );

        writeQuery(data, context);

        return data;
      };
    }

    return descriptor;
  };
}
