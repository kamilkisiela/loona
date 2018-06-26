import { DocumentNode } from 'graphql';
import { getNameOfMutation } from '@loona/core';

const prefix = '@@mutation: ';

export function mutationToType(action: any): string {
  const mutation = getMutation(action);
  const name = getNameOfMutation(mutation);

  return `${prefix}${name}`;
}

export function getMutation(action: any): DocumentNode {
  if (action.constructor && action.constructor.mutation) {
    return action.constructor.mutation;
  }

  return action.mutation;
}

export function isMutation(action: any): boolean {
  return typeof getMutation(action) !== 'undefined';
}
