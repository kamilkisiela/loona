import {ErrorHandler} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {of, throwError} from 'rxjs';
import gql from 'graphql-tag';

import {InnerActions, ScannedActions} from '../src/actions';
import {Loona} from '../src/client';

describe('Loona', () => {
  let apollo: Apollo;
  let errorHandler: ErrorHandler;
  let actions: InnerActions;
  let scannedActions: ScannedActions;
  let loona: Loona;

  beforeEach(() => {
    apollo = {
      watchQuery() {},
      mutate() {},
    } as any;
    errorHandler = new ErrorHandler();
    actions = new InnerActions();
    scannedActions = new ScannedActions();
    loona = new Loona(apollo, actions, scannedActions, errorHandler);
  });

  describe('query()', () => {
    test('pass DocumentNode as the first argument', () => {
      const spy = spyOn(apollo, 'watchQuery').and.returnValue('return');
      const query = gql`
        {
          test
        }
      `;

      expect(loona.query(query)).toEqual('return');
      expect(spy).toBeCalledWith({
        query,
      });
    });

    test('have variables and options separated', () => {
      const spy = spyOn(apollo, 'watchQuery').and.returnValue('return');
      const query = gql`
        {
          test
        }
      `;
      const variables = {
        foo: 42,
      };

      expect(
        loona.query(query, variables, {
          fetchPolicy: 'network-only',
        }),
      ).toEqual('return');
      expect(spy).toBeCalledWith({
        query,
        variables,
        fetchPolicy: 'network-only',
      });
    });
  });

  describe('mutate()', () => {
    test('dispatch on result', done => {
      const mutation = gql`
        mutation test {
          test
        }
      `;
      const variables = {
        foo: 41,
      };
      const result = {
        data: {
          test: 42,
        },
      };
      const spyApollo = spyOn(apollo, 'mutate').and.callFake(() => of(result));

      scannedActions.subscribe(action => {
        expect(action).toEqual({
          type: 'mutation',
          options: {
            mutation,
            variables,
          },
          ok: true,
          ...result,
        });

        done();
      });

      loona
        .mutate({
          mutation,
          variables,
        })
        .subscribe();

      expect(spyApollo).toHaveBeenCalledWith({
        mutation,
        variables,
      });
    });

    test('dispatch on error', done => {
      const mutation = gql`
        mutation test {
          test
        }
      `;
      const variables = {
        foo: 41,
      };
      const error = {
        message: 'booooo',
      };
      const spyApollo = spyOn(apollo, 'mutate').and.callFake(() =>
        throwError(error),
      );

      scannedActions.subscribe(action => {
        expect(action).toEqual({
          type: 'mutation',
          options: {
            mutation,
            variables,
          },
          ok: false,
          ...error,
        });

        done();
      });

      loona
        .mutate({
          mutation,
          variables,
        })
        .subscribe();

      expect(spyApollo).toHaveBeenCalledWith({
        mutation,
        variables,
      });
    });
  });

  describe('dispatch()', () => {
    test('dispatch plain object', done => {
      const action = {
        type: 'test',
        foo: 42,
      };
      scannedActions.subscribe(received => {
        expect(received).toEqual(action);
        done();
      });

      loona.dispatch(action);
    });

    test('dispatch an instance', done => {
      class Test {
        static type = 'test';
        constructor(public foo: number) {}
      }
      scannedActions.subscribe(received => {
        expect(received).toEqual({
          type: 'test',
          foo: 42,
        });
        done();
      });

      loona.dispatch(new Test(42));
    });

    test('dispatch a MutationAsAction (instance)', done => {
      class Test {
        static mutation = gql`
          mutation test {
            test
          }
        `;
        constructor(
          public variables: {
            foo: number;
          },
        ) {}
      }

      const result = {
        data: {
          test: 'yes',
        },
      };

      spyOn(apollo, 'mutate').and.callFake(() => of(result));
      const spy = spyOn(loona, 'mutate').and.callThrough();

      scannedActions.subscribe(received => {
        expect(received).toEqual({
          type: 'mutation',
          options: {
            mutation: Test.mutation,
            variables: {foo: 42},
          },
          ok: true,
          ...result,
        });
        done();
      });

      loona.dispatch(new Test({foo: 42}));

      expect(spy).toHaveBeenCalledWith({
        mutation: Test.mutation,
        variables: {foo: 42},
      });
    });

    test('dispatch a MutationAsAction (plain object)', done => {
      const action = {
        mutation: gql`
          mutation test {
            test
          }
        `,
        variables: {
          foo: 42,
        },
      };

      const result = {
        data: {
          test: 'yes',
        },
      };

      spyOn(apollo, 'mutate').and.callFake(() => of(result));
      const spy = spyOn(loona, 'mutate').and.callThrough();

      scannedActions.subscribe(received => {
        expect(received).toEqual({
          type: 'mutation',
          options: action,
          ok: true,
          ...result,
        });
        done();
      });

      loona.dispatch(action);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });

  test('use errorHandler on error', () => {
    const error = new Error('Foo');
    const spy = spyOn(errorHandler, 'handleError');

    actions.error(error);

    expect(spy).toHaveBeenCalledWith(error);
  });
});
