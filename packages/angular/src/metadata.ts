export const METADATA_KEY = '@@luna';

export namespace Metadata {
  export type Queries = Array<{ propName: string }>;
  export type Mutations = Array<{ propName: string; options: any }>;
  export type Actions = Record<
    string,
    Array<{ propName: string; type: string; options: any }>
  >;
  export type Defaults = Record<string, any>;
  export type TypeDefs = string | string[];
}

export interface Metadata {
  queries: Metadata.Queries;
  mutations: Metadata.Mutations;
  actions: Metadata.Actions;
  defaults?: Metadata.Defaults;
  typeDefs?: Metadata.TypeDefs;
}

export function ensureMetadata(target: any): Metadata {
  if (!target.hasOwnProperty(METADATA_KEY)) {
    const defaultValue: Metadata = {
      defaults: [],
      mutations: [],
      actions: {},
      queries: [],
      typeDefs: [],
    };

    Object.defineProperty(target, METADATA_KEY, {
      value: defaultValue,
    });
  }

  return target[METADATA_KEY];
}
