import {ResolveFn} from './common';

export type QueryDef = {
  name: string;
  resolve: ResolveFn;
};
