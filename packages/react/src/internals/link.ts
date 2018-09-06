import {LoonaLink} from '@loona/core';
import {ApolloCache} from 'apollo-cache';

export function createLoona(cache: ApolloCache<any>) {
  return new LoonaLink({
    cache,
  });
}
