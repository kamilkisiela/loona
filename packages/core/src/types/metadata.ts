import {DocumentNode} from 'graphql';
import {UpdateMatchFn} from './update';

export namespace Metadata {
  export type Resolvers = Array<{
    propName: string;
    path: string;
  }>;
  export type Mutations = Array<{
    propName: string;
    mutation: DocumentNode | string;
    options: any;
  }>;
  export type Updates = Array<{
    propName: string;
    match: UpdateMatchFn;
  }>;
  export type Defaults = Record<string, any>;
  export type TypeDefs = string | string[];
  export type Effects = Record<
    string,
    Array<{propName: string; type: string; options: any}>
  >;
}

export interface Metadata {
  resolvers: Metadata.Resolvers;
  mutations: Metadata.Mutations;
  updates: Metadata.Updates;
  defaults?: Metadata.Defaults;
  typeDefs?: Metadata.TypeDefs;
  effects: Metadata.Effects;
}
