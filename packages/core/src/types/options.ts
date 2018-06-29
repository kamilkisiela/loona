import {ApolloCache} from 'apollo-cache';

import {MutationDef} from './mutation';
import {QueryDef} from './query';
import {UpdateDef} from './update';

export interface Options {
  cache: ApolloCache<any>;
  mutations?: MutationDef[];
  queries?: QueryDef[];
  updates?: UpdateDef[];
  defaults?: any;
  resolvers?: any;
  typeDefs?: string | string[];
}
