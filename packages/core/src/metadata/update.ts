import {UpdateDef, UpdateResolveFn} from '../types/update';
import {Metadata} from '../types/metadata';
import {ensureMetadata} from './metadata';

export function setUpdateMetadata(
  proto: any,
  propName: string,
  mutation: string,
) {
  const constructor = proto.constructor;
  const meta = ensureMetadata(constructor);

  meta.updates.push({
    propName,
    mutation,
  });
}

export function transformUpdates(
  instance: any,
  meta: Metadata,
  transformFn: ((resolver: any) => UpdateResolveFn) = resolver => resolver,
): UpdateDef[] | undefined {
  if (meta.updates) {
    return meta.updates.map(({propName, mutation}) => ({
      mutation,
      resolve: transformFn(instance[propName].bind(instance)),
    }));
  }
}
