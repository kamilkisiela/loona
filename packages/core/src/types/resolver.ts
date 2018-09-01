import {ResolveFn} from './common';

export interface Resolvers {
  [key: string]: {
    [key: string]: ResolveFn;
  };
}

export interface ResolverDef {
  path: string;
  resolve: ResolveFn;
}
