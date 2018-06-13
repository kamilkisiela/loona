import { MutationDef } from '@apollo-flux/core';
import { ensureMetadata } from './metadata';

export function Mutation(options?: any) {
  return function(
    target: any,
    name: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) {
    // const meta = ensureMetadata(target.constructor);
    // meta.mutations.push();
  };
}

export function extractMutations(states: any[] = []): MutationDef[] {
  return states.reduce((mem, state) => mem.concat(state.mutations), []);
}
