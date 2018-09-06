import {DocumentNode} from 'graphql';

import {Context, ResolveFn} from './common';

export interface MutationObject {
  mutation: DocumentNode;
  [key: string]: any;
}

export interface MutationSchema {
  [key: string]: ResolveFn;
}

export interface MutationDef {
  mutation: string;
  resolve: MutationResolveFn;
}

export type MutationResolveFn = (
  args: Record<string, any>,
  context: Context & Record<string, any>,
) => Promise<any> | any;

export type MutationMethod = (
  args: Record<string, any>,
  context: Context,
) => any;
