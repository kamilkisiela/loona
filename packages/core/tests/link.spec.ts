import {execute, ApolloLink} from 'apollo-link';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import gql from 'graphql-tag';

import {LoonaLink} from '../src/link';
import {Manager} from '../src/manager';

function createClient(cache: InMemoryCache) {
  return new ApolloClient({
    link: new ApolloLink(),
    cache,
  });
}

describe('LoonaLink', () => {
  test('accepts Manager', () => {
    const cache = new InMemoryCache();
    const client = createClient(cache);
    const manager = new Manager({
      cache,
      getClient: () => client,
    });
    const link = new LoonaLink(manager);

    expect(link.manager).toBe(manager);
  });

  test(`accepts Manager's options`, () => {
    const options = {cache: new InMemoryCache()};
    const link = new LoonaLink(options);

    expect(link.manager).toBeInstanceOf(Manager);
    expect(link.manager.cache).toBe(options.cache);
  });

  test(`writes defaults`, () => {
    const options = {
      cache: new InMemoryCache(),
      defaults: {
        foo: 42,
      },
    };
    const link = new LoonaLink(options);
    const result = link.manager.cache.readQuery<any>({
      query: gql`
        {
          foo
        }
      `,
    });

    expect(result.foo).toEqual(42);
  });

  test('sets mutations', done => {
    const def = {
      mutation: 'foo',
      resolve: jest.fn(() => 42),
    };
    const cache = new InMemoryCache();
    const client = createClient(cache);
    const options = {
      cache: new InMemoryCache(),
      mutations: [def],
      getClient: () => client,
    };
    const link = new LoonaLink(options);

    execute(link, {
      query: gql`
        mutation foo {
          foo @client
        }
      `,
    }).subscribe((result: any) => {
      expect(result.data.foo).toEqual(42);
      done();
    }, done.fail);
  });

  test('sets resolvers', done => {
    const def = {
      path: 'Query.foo',
      resolve: jest.fn(() => 42),
    };
    const cache = new InMemoryCache();
    const client = createClient(cache);
    const options = {
      cache,
      resolvers: [def],
      getClient: () => client,
    };
    const link = new LoonaLink(options);

    execute(link, {
      query: gql`
        {
          foo @client
        }
      `,
    }).subscribe((result: any) => {
      expect(result.data.foo).toEqual(42);
      done();
    }, done.fail);
  });
});
