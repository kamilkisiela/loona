import gql from 'graphql-tag';

import {
  getMutation,
  isMutation,
  getNameOfMutation,
  mutationToType,
} from '../src/mutation';

describe('getMutation()', () => {
  test('get mutation from instance', () => {
    expect(
      getMutation(
        new class Foo {
          static mutation = 'mutation';
        }(),
      ),
    ).toEqual('mutation');
  });

  test('get mutation from plain object', () => {
    expect(
      getMutation({
        mutation: 'mutation',
      }),
    ).toEqual('mutation');
  });
});

describe('isMutation()', () => {
  test('based instance', () => {
    expect(
      isMutation(
        new class Foo {
          static mutation = 'mutation';
        }(),
      ),
    ).toBe(true);
  });

  test('based on plain object', () => {
    expect(
      isMutation({
        mutation: 'mutation',
      }),
    ).toBe(true);
  });

  test('fail when missing mutation property', () => {
    expect(
      isMutation({
        type: 'mutation',
      }),
    ).toBe(false);
  });
});

describe('getNameOfMutation()', () => {
  test('get name of mutation', () => {
    expect(
      getNameOfMutation(gql`
        mutation fooMutation {
          foo
        }
      `),
    ).toEqual('foo');
  });
});

describe('mutationToType()', () => {
  test('short for getMutation + getNameOfMutation', () => {
    expect(
      mutationToType({
        mutation: gql`
          mutation fooMutation {
            foo
          }
        `,
      }),
    ).toEqual('foo');
  });
});
