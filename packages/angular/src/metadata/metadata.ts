import {ensureMetadata as coreEnsureMetadata, METADATA_KEY} from '@loona/core';
import {Metadata} from '../types/metadata';

export function ensureMetadata(target: any): Metadata {
  const meta = coreEnsureMetadata<Metadata>(target);

  console.log('coremeta', {...meta});

  if (!target[METADATA_KEY].actions) {
    target[METADATA_KEY].actions = [] as any;
  }

  console.log('meta', {...target[METADATA_KEY]});

  return target[METADATA_KEY];
}
