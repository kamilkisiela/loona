import {DataProxy} from 'apollo-cache';

export type ResolveFn = (
  _: any,
  args: Record<string, any>,
  context: Context & Record<string, any>,
) => Promise<any> | any;

export interface Context {
  cache: DataProxy;
}
