import {
  isMutation,
  mutationToType,
  ensureMetadata,
  MutationObject,
  isDocument,
  getNameOfMutation,
} from '@loona/core';
import {DocumentNode} from 'graphql';
import {Metadata, ActionMethod, ActionObject} from './internals/types';

export {State, Mutation, Update, Resolve} from '@loona/core';

export type ActionDef = string | DocumentNode | ActionObject | MutationObject;

export function Action<T = any>(
  actions: ActionDef | ActionDef[],
  options?: any,
) {
  return function(
    target: any,
    name: string,
    _descriptor: TypedPropertyDescriptor<ActionMethod<T>>,
  ) {
    setActionMetadata(
      target,
      name,
      Array.isArray(actions) ? actions : [actions],
      options,
    );
  };
}

export const Listen = Action;

function setActionMetadata(
  proto: any,
  propName: string,
  actions: ActionDef[],
  options?: any,
) {
  const constructor = proto.constructor;
  const meta = ensureMetadata<Metadata>(constructor);

  if (!meta.actions) {
    meta.actions = [] as any;
  }

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
      throw new Error(`Loona couldn't figure out the type of action`);
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
