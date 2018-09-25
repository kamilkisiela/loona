import {ApolloClient} from 'apollo-client';
import {ApolloCache} from 'apollo-cache';

import {MutationDef} from './mutation';
import {UpdateDef} from './update';

export interface Options {
  getClient?: () => ApolloClient<any>;
  cache: ApolloCache<any>;
  mutations?: MutationDef[];
  updates?: UpdateDef[];
  defaults?: any;
  resolvers?: any;
  typeDefs?: string | string[];
}
