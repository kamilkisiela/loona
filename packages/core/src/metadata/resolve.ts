import {ensureMetadata} from './metadata';
import {Metadata} from '../types/metadata';
import {ResolverDef} from '../types/resolver';
import {ResolveFn} from '../types/common';

export function setResolveMetadata(proto: any, propName: string, path: string) {
  const constructor = proto.constructor;
  const meta = ensureMetadata(constructor);

  meta.resolvers.push({propName, path});
}

export function transformResolvers(
  instance: any,
  meta: Metadata,
  transformFn: ((resolver: any) => ResolveFn) = resolver => resolver,
): ResolverDef[] | undefined {
  return meta.resolvers.map(({propName, path}) => ({
    name: propName,
    path,
    resolve: transformFn(instance[propName].bind(instance)),
  }));
}
