import {NgModule} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {LoonaLink} from '@loona/core';
import {take} from 'rxjs/operators';
import gql from 'graphql-tag';

import {LoonaModule} from '../../src/module';
import {LOONA_CACHE} from '../../src/tokens';
import {Loona} from '../../src/client';
import {Actions, ScannedActions} from '../../src/actions';
import {State} from '../../src/index';

describe('Integration - module', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('forRoot()', () => {
    let cache: InMemoryCache;

    @State({
      defaults: {
        foo: 42,
      },
    })
    class FooState {
      constructor(public loona: Loona) {}
    }

    beforeEach(() => {
      cache = new InMemoryCache();

      TestBed.configureTestingModule({
        imports: [ApolloModule, LoonaModule.forRoot([FooState])],
        providers: [
          {
            provide: LOONA_CACHE,
            useFactory() {
              return cache;
            },
          },
          {
            provide: APOLLO_OPTIONS,
            useFactory(link: LoonaLink) {
              return {
                link,
                cache,
              };
            },
            deps: [LoonaLink],
          },
        ],
      });
    });

    test('provide LoonaLink', () => {
      expect(TestBed.get(LoonaLink)).toBeInstanceOf(LoonaLink);
    });

    test('provide Loona', () => {
      expect(TestBed.get(Loona)).toBeInstanceOf(Loona);
    });

    test('provide Actions', () => {
      expect(TestBed.get(Actions)).toBeInstanceOf(ScannedActions);
    });

    test('provide states', () => {
      const fooState: FooState = TestBed.get(FooState);
      expect(fooState).toBeInstanceOf(FooState);
      expect(fooState.loona).toBeInstanceOf(Loona);
    });

    test('write defaults', async () => {
      const loona: Loona = TestBed.get(Loona);

      const result = await loona
        .query(
          gql`
            {
              foo
            }
          `,
        )
        .valueChanges.pipe(take(1))
        .toPromise();

      expect(result.data).toEqual({
        foo: 42,
      });
    });
  });

  describe('forChild()', () => {
    let cache: InMemoryCache;

    @State({
      defaults: {
        foo: 42,
      },
    })
    class FooState {
      constructor(public loona: Loona) {}
    }

    beforeEach(() => {
      cache = new InMemoryCache();

      @NgModule({
        imports: [ApolloModule, LoonaModule.forRoot()],
        providers: [
          {
            provide: LOONA_CACHE,
            useFactory() {
              return cache;
            },
          },
          {
            provide: APOLLO_OPTIONS,
            useFactory(link: LoonaLink) {
              return {
                link,
                cache,
              };
            },
            deps: [LoonaLink],
          },
        ],
      })
      class RootModule {}

      TestBed.configureTestingModule({
        imports: [RootModule, LoonaModule.forChild([FooState])],
      });
    });

    test('provide Loona', () => {
      expect(TestBed.get(Loona)).toBeInstanceOf(Loona);
    });

    test('provide Actions', () => {
      expect(TestBed.get(Actions)).toBeInstanceOf(ScannedActions);
    });

    test('provide states', () => {
      const fooState: FooState = TestBed.get(FooState);
      expect(fooState).toBeInstanceOf(FooState);
      expect(fooState.loona).toBeInstanceOf(Loona);
    });

    test('write defaults', async () => {
      const loona: Loona = TestBed.get(Loona);

      const result = await loona
        .query(
          gql`
            {
              foo
            }
          `,
        )
        .valueChanges.pipe(take(1))
        .toPromise();

      expect(result.data).toEqual({
        foo: 42,
      });
    });
  });
});
