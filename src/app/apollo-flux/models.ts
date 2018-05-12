import { MutationOptions } from 'apollo-client';
import { DataProxy } from 'apollo-cache';

export interface State {
  resolvers?: any;
  defaults?: any;
  typeDefs?: any;
}

export interface Mutation<T = Record<string, any>> {
  name: string;
  variables?: T;
  extra?: any;
}

export type MutationOptionsFn = (mutation: Mutation) => MutationOptions;

export interface MutationDef<T = any> {
  options: MutationOptions | MutationOptionsFn;
  name: string;
}

export type MutationDefMap = Record<string, MutationDef>;

export interface Update {
  name: string;
  variables?: Record<string, any>;
  cache: DataProxy;
  result: any;
  options: MutationOptions;
}

export type UpdateFn = (update: Update) => void;
