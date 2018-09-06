import {ensureMetadata as coreEnsureMetadata} from '@loona/core';
import {Metadata} from '../types/metadata';

export function ensureMetadata(target: any): Metadata {
  const meta = coreEnsureMetadata<Metadata>(target);

  if (!meta.actions) {
    meta.actions = [] as any;
  }

  return meta;
}
