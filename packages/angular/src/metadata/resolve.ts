import {ensureMetadata} from './metadata';

export function setResolveMetadata(proto: any, propName: string, path: string) {
  const constructor = proto.constructor;
  const meta = ensureMetadata(constructor);

  meta.resolvers.push({propName, path});
}
