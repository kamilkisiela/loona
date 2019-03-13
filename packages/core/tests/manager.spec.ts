import {ApolloLink} from 'apollo-link';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';

import {Manager} from '../src/manager';

function createClient(cache: InMemoryCache) {
  return new ApolloClient({
    link: new ApolloLink(),
    cache,
  });
}

describe('Manager', () => {
  test('accepts client', () => {
    const cache = new InMemoryCache();
    const client = createClient(cache);
    const manager = new Manager({
      getClient: () => client,
    });

    expect(manager.getClient()).toBe(client);
  });
});
