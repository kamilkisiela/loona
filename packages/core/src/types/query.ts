import {ResolveFn} from './common';

export interface QuerySchema {
  [key: string]: QueryResolveFn;
}

export type QueryDef = {
  name: string;
  resolve: QueryResolveFn;
};

export type QueryResolveFn = ResolveFn;
