import { DocumentNode } from 'graphql';
import { DataProxy } from 'apollo-cache';

export function update(query: DocumentNode, fn) {
  return (_root, args, context) => {
    const cache: DataProxy = context.cache;
    const previous = cache.readQuery({ query });

    const data = fn(previous, args);

    cache.writeQuery({ query, data });

    return data.currentGame;
  };
}
