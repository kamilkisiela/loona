import { ensureMetadata } from './metadata';

export function setMutationMetadata(
  proto: any,
  propName: string,
  options?: any,
) {
  const constructor = proto.constructor;
  const meta = ensureMetadata(constructor);

  meta.mutations.push({ propName, options });
}
