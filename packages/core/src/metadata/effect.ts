import {ensureMetadata} from './metadata';
import {EffectDef} from '../types/effect';
import {getNameOfMutation, isMutation, mutationToType} from '../mutation';
import {isDocument} from '../helpers';

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
