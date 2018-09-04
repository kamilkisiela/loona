import {LoonaLink} from '@loona/core';
import {ApolloCache} from 'apollo-cache';

//  mutations?: MutationDef[];
//  queries?: QueryDef[];
//  updates?: UpdateDef[];
//  defaults?: any;
//  resolvers?: any;
//  typeDefs?: string | string[];

export function createLoona(cache: ApolloCache<any>, states?: any[]) {
  console.log('states', states);

  let mutations: any[] = [];

  if (states) {
    states.forEach(state => {
      mutations.push(...state.mutations);
    });
  }

  // extract from states
  // [ ] mutations
  // [ ] updates
  // [ ] resolvers
  // [ ] defaults
  // [ ] typeDefs
  // [ ] queries?

  return new LoonaLink({
    cache,
    mutations
  });
}
