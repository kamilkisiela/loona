import { ensureMetadata } from './metadata';

export function setQueryMetadata(proto: any, propName: string) {
  const constructor = proto.constructor;
  const meta = ensureMetadata(constructor);

  meta.queries.push({ propName });
}
