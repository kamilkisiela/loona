import {DocumentNode} from 'graphql';

import {ResolveFn} from './common';

export interface Mutation<V = any> {
  name: string;
  variables?: V;
}

export interface MutationSchema {
  [key: string]: MutationResolveFn;
}

export interface MutationDef {
  mutation: DocumentNode;
  resolve: MutationResolveFn;
}

export type MutationResolveFn = ResolveFn;
