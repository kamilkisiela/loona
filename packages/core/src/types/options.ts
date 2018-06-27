import {ApolloCache} from 'apollo-cache';

import {MutationDef} from './mutation';
import {QueryDef} from './query';

export interface Options {
  cache: ApolloCache<any>;
  mutations?: MutationDef[];
  queries?: QueryDef[];
  defaults?: any;
  resolvers?: any;
  typeDefs?: string | string[];
}
