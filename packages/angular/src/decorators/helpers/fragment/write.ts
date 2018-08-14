import {Context} from '@loona/core';
import {DocumentNode} from 'graphql';

export function WriteFragment(fragment: DocumentNode) {
  return (
    target: any,
    _propName: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const fn = descriptor.value.bind(target);

    if (fn) {
      descriptor.value = (_: any, args: any, context: Context) => {
        const {cache, getCacheKey} = context;
        const data = fn(_, args, context);
        const id = getCacheKey(data);

        console.log('@Write: data', data);
        console.log('@Write: id', id);

        cache.writeFragment({
          fragment,
          id,
          data,
        });

        console.log('@Write: wrote');

        return data;
      };
    }

    return descriptor;
  };
}
