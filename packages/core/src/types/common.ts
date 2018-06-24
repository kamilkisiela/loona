import { DataProxy } from 'apollo-cache';

export type ResolveFn = (
  _: any,
  args: Record<string, any>,
  context: { cache: DataProxy } & Record<string, any>,
) => Promise<any> | any;
