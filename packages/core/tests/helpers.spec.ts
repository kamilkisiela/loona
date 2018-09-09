import {InMemoryCache} from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import {
  getFragmentTypename,
  writeFragment,
  readFragment,
  patchFragment,
  writeQuery,
  readQuery,
  patchQuery,
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
  }
`;

const query = gql`
  {
    foo
  }
`;

describe('getFragmentTypename()', () => {
  test('get fragment typename', () => {
    expect(getFragmentTypename(fragment)).toEqual('Foo');
  });
});

describe('fragments', () => {
  test('write fragment and guess typename', () => {
    const cache = new InMemoryCache();
    const obj = {
      id: 42,
    };
    const spy = spyOn(cache, 'writeFragment');

    writeFragment(fragment, obj, buildReceivedContext(cache));

    expect(spy).toHaveBeenCalledWith({
      fragment,
      id: 'Foo:42',
      data: {
        __typename: 'Foo',
        ...obj,
      },
    });
  });

  test('read fragment and guess typename', () => {
    const cache = new InMemoryCache();
    const obj = {
      id: 42,
    };
    const spy = spyOn(cache, 'readFragment');

    readFragment(fragment, obj, buildReceivedContext(cache));

    expect(spy).toHaveBeenCalledWith({
      fragment,
      id: 'Foo:42',
    });
  });

  test('patch fragment', () => {
    const cache = new InMemoryCache();
    const obj = {
      id: 42,
    };
    const spy = spyOn(cache, 'writeFragment');

    patchFragment(buildReceivedContext(cache))(fragment, obj, () => obj);

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
  test('write query', () => {
    const cache = new InMemoryCache();
    const obj = {
      foo: 42,
    };
    const spy = spyOn(cache, 'writeData');

    writeQuery(obj, buildReceivedContext(cache));

    expect(spy).toHaveBeenCalledWith({
      data: obj,
    });
  });

  test('read query', () => {
    const cache = new InMemoryCache();
    const spy = spyOn(cache, 'readQuery');

    readQuery(query, buildReceivedContext(cache));

    expect(spy).toHaveBeenCalledWith({query});
  });

  test('patch query', () => {
    const cache = new InMemoryCache();
    const obj = {
      foo: 42,
    };

    cache.writeData({
      data: {
        foo: 41,
      },
    });

    const spy = spyOn(cache, 'writeData');

    patchQuery(buildReceivedContext(cache))(query, data => {
      data.foo = obj.foo;
    });

    expect(spy).toHaveBeenCalledWith({
      data: obj,
    });
  });
});
