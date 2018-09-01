import {UpdateMatchFn} from '@loona/core';
import {DocumentNode} from 'graphql';

export namespace Metadata {
  export type Queries = Array<{propName: string}>;
  export type Resolvers = Array<{
    propName: string,
    path: string,
  }>;
  export type Mutations = Array<{
    propName: string;
    mutation: DocumentNode;
    options: any;
  }>;
  export type Updates = Array<{
    propName: string;
    match: UpdateMatchFn;
  }>;
  export type Actions = Record<
    string,
    Array<{propName: string; type: string; options: any}>
  >;
  export type Defaults = Record<string, any>;
  export type TypeDefs = string | string[];
}

export interface Metadata {
  queries: Metadata.Queries;
  resolvers: Metadata.Resolvers;
  mutations: Metadata.Mutations;
  updates: Metadata.Updates;
  actions: Metadata.Actions;
  defaults?: Metadata.Defaults;
  typeDefs?: Metadata.TypeDefs;
}
