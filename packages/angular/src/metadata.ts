import {
  ensureMetadata as coreEnsureMetadata,
  isMutation,
  mutationToType,
  isDocument,
  getNameOfMutation,
} from '@loona/core';
import {Metadata, EffectDef} from './types';

export function setEffectMetadata(
  proto: any,
  propName: string,
  effects: EffectDef[],
  options?: any,
) {
  const constructor = proto.constructor;
  const meta = ensureMetadata(constructor);

  for (const action of effects) {
    let type: string | undefined = undefined;

    if (typeof action === 'string') {
      type = action;
    } else if (isMutation(action)) {
      type = mutationToType(action);
    } else if (isDocument(action)) {
      type = getNameOfMutation(action);
    } else if (typeof action.type === 'string') {
      type = action.type;
    }

    if (!type) {
      throw new Error(`Loona couldn't figure out the type of the action`);
    }

    if (!meta.effects[type]) {
      meta.effects[type] = [];
    }

    meta.effects[type].push({
      propName,
      options: options || {},
      type,
    });
  }
}

export function ensureMetadata(target: any): Metadata {
  const meta = coreEnsureMetadata<Metadata>(target);

  if (!meta.effects) {
    meta.effects = [] as any;
  }

  return meta;
}
