import {ensureMetadata} from './metadata';
import {isMutation, mutationToType} from '../internal/mutation';

export function setActionMetadata(
  proto: any,
  propName: string,
  actions: any[],
  options?: any,
) {
  const constructor = proto.constructor;
  const meta = ensureMetadata(constructor);

  for (const action of actions) {
    const type = isMutation(action) ? mutationToType(action) : action.type;

    if (!type) {
      throw new Error(
        `Action (or Mutation) ${
          (action as any).name
        } is missing a static property ('type' on Action, 'mutation' on Mutation)`,
      );
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
