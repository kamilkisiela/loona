import { ensureMetadata } from './metadata';

export function setActionMetadata(
  proto: any,
  propName: string,
  actions: any[],
  options?: any,
) {
  const constructor = proto.constructor;
  const meta = ensureMetadata(constructor);

  for (const action of actions) {
    const type = action.type;

    if (!action.type) {
      throw new Error(
        `Action ${(action as any).name} is missing a static "type" property`,
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
