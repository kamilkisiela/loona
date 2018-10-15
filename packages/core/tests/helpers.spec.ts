import {ApolloClient} from 'apollo-client';
import {ApolloLink} from 'apollo-link';
import {InMemoryCache} from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import {
  getFragmentTypename,
  patchFragment,
  patchQuery,
  getActionType,
} from '../src/helpers';

const buildReceivedContext = (cache: InMemoryCache) => {
  return {
    cache,
    getCacheKey: (obj: {__typename: string; id: string | number}) => {
      if ((cache as any).config) {
        return (cache as any).config.dataIdFromObject(obj);
      } else {
        throw new Error(
          'To use context.getCacheKey, you need to use a cache that has a configurable dataIdFromObject, like apollo-cache-inmemory.',
        );
      }
    },
  };
};

const fragment = gql`
  fragment foo on Foo {
    id
    text
  }
`;

const query = gql`
  {
    foo
  }
`;

function createClient(cache: InMemoryCache) {
  return new ApolloClient({
    link: new ApolloLink(),
    cache,
  });
}

describe('getFragmentTypename()', () => {
  test('get fragment typename', () => {
    expect(getFragmentTypename(fragment)).toEqual('Foo');
  });
});

describe('fragments', () => {
  test('patch fragment', () => {
    const cache = new InMemoryCache();
    const client = createClient(cache);
    const obj = {
      id: 42,
      text: 'new',
    };
    const spy = spyOn(client, 'writeFragment');

    cache.writeFragment({
      fragment,
      id: `Foo:42`,
      data: {
        id: 42,
        text: 'old',
        __typename: 'Foo',
      },
    });

    patchFragment(buildReceivedContext(cache), client)(
      fragment,
      obj,
      () => obj,
    );

    expect(spy).toHaveBeenCalledWith({
      fragment,
      id: 'Foo:42',
      data: {
        __typename: 'Foo',
        ...obj,
      },
    });
  });
});

describe('queries', () => {
  test('patch query', () => {
    const cache = new InMemoryCache();
    const client = createClient(cache);
    const obj = {
      foo: 42,
    };

    cache.writeData({
      data: {
        foo: 41,
      },
    });

    const spy = spyOn(client, 'writeQuery');

    patchQuery(client)(query, data => {
      data.foo = obj.foo;
    });

    expect(spy).toHaveBeenCalledWith({
      query,
      data: obj,
    });
  });
});

describe('getActionType', () => {
  test('should handle a class with static type property', () => {
    expect(
      getActionType(
        class Something {
          static type = 'foo';
        },
      ),
    ).toEqual('foo');
  });

  test('should handle an instance of a class with static type property', () => {
    expect(
      getActionType(
        new class Something {
          static type = 'foo';
        }(),
      ),
    ).toEqual('foo');
  });

  test('should handle a class with static type property', () => {
    expect(
      getActionType({
        type: 'foo',
      }),
    ).toEqual('foo');
  });
});
