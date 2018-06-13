import { QueryDef } from '@apollo-flux/core';

export function Query(options?: any) {
  return function(
    target: any,
    name: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) {};
}

export function extractQueries(states: any[] = []): QueryDef[] {
  return states.reduce((mem, state) => mem.concat(state.queries), []);
}
