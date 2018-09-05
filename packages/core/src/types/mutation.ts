import {DocumentNode} from 'graphql';

import {Context, ResolveFn} from './common';

export interface MutationSchema {
  [key: string]: ResolveFn;
}

export interface MutationDef {
  mutation: DocumentNode;
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
