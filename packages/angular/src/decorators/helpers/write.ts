import {DocumentNode} from 'graphql';

import {getKind} from '../../internal/utils';
import {WriteQuery} from './query/write';
import {WriteFragment} from './fragment/write';

// @Mutation(AddTodo)
// @Write(todoFragment)
// resolver(_, args, context) {}
//
// it gets fragment's id based on context.getCacheKey(returned object)

// @Mutation(AddTodo)
// @Update(todoFragment, ({id}) => `Todo:${id}`)
//
// to update, it needs to read first
// to read it needs a fragment's id
// that's why we provide (args, context) => string

export function Write(doc?: DocumentNode) {
  if (doc && getKind(doc) === 'fragment') {
    return WriteFragment(doc);
  }

  return WriteQuery();
}
