import {DataProxy} from 'apollo-cache';
import {DocumentNode} from 'graphql';

export type ResolveFn = (
  _: any,
  args: Record<string, any>,
  context: Context & Record<string, any>,
) => Promise<any> | any;

export interface ReceivedContext {
  cache: DataProxy;
  getCacheKey(obj: any): string;
}

export interface Context extends ReceivedContext {
  // reads and writes
  patchQuery(query: DocumentNode, producer: (data: any) => any): any;
  // reads and writes
  patchFragment(
    fragment: DocumentNode,
    obj: any,
    producer: (data: any) => any,
  ): any;
  // writes
  writeData(options: DataProxy.WriteDataOptions<any>): any;
}
