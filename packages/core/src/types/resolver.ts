import {ResolveFn, Context} from './common';

export interface Resolvers {
  [key: string]: {
    [key: string]: ResolveFn;
  };
}

export interface ResolverDef {
  path: string;
  resolve: ResolveFn;
}

export type ResolveMethod = (
  parent: any,
  args: Record<string, any>,
  context: Context,
) => any;
