import {Context, MutationInfo} from '@loona/core';

export function WriteQuery() {
  return (
    target: any,
    _propName: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const fn = descriptor.value.bind(target);

    if (fn) {
      descriptor.value = (info: MutationInfo, context: Context) => {
        const data = fn(info, context);

        context.cache.writeData({
          data,
        });

        return data;
      };
    }

    return descriptor;
  };
}
