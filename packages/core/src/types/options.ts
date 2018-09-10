import {ApolloCache} from 'apollo-cache';
import {FragmentMatcher} from 'graphql-anywhere';

import {MutationDef} from './mutation';
import {UpdateDef} from './update';

export interface Options {
  cache: ApolloCache<any>;
  mutations?: MutationDef[];
  updates?: UpdateDef[];
  defaults?: any;
  resolvers?: any;
  typeDefs?: string | string[];
  fragmentMatcher?: FragmentMatcher;
}
