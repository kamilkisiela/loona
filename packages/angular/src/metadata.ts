import { MutationDef, QueryDef, UpdateDef } from '@apollo-flux/core';

const METADATA_KEY = '@@apollo-flux';

export interface StateMetadata {
  queries: QueryDef[];
  mutations: MutationDef[];
  updates: UpdateDef[];
  defaults: any;
  typeDefs?: string | string[];
}

export function ensureMetadata(target: any): StateMetadata {
  if (!target.hasOwnProperty(METADATA_KEY)) {
    const defaultValue: StateMetadata = {
      defaults: [],
      mutations: [],
      queries: [],
      updates: [],
      typeDefs: [],
    };

    Object.defineProperty(target, METADATA_KEY, {
      value: defaultValue,
    });
  }

  return target[METADATA_KEY];
}
