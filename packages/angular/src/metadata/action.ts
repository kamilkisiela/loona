import {
  isMutation,
  mutationToType,
  isDocument,
  getNameOfMutation,
} from '@loona/core';
import {ensureMetadata} from './metadata';
import {ActionDef} from '../types/action';

export function setActionMetadata(
  proto: any,
  propName: string,
  actions: ActionDef[],
  options?: any,
) {
  const constructor = proto.constructor;
  const meta = ensureMetadata(constructor);

  for (const action of actions) {
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

    if (!meta.actions[type]) {
      meta.actions[type] = [];
    }

    meta.actions[type].push({
      propName,
      options: options || {},
      type,
    });
  }
}
