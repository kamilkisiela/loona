import { DocumentNode } from 'graphql';

export namespace Metadata {
  export type Queries = Array<{ propName: string }>;
  export type Mutations = Array<{
    propName: string;
    mutation: DocumentNode;
    options: any;
  }>;
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
