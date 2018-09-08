import {Manager, LoonaLink} from '@loona/core';

import {
  managerFactory,
  linkFactory,
  LoonaModule,
  LoonaRootModule,
  LoonaChildModule,
} from '../src/module';
import {Loona} from '../src/client';
import {InnerActions, ScannedActions, Actions} from '../src/actions';
import {Effects, EffectsRunner} from '../src/effects';
import {LOONA_CACHE, INITIAL_STATE, CHILD_STATE} from '../src/tokens';

describe('managerFactory', () => {
  test('pass a Cache', () => {
    const cache: any = 'cache';
    const manager = managerFactory(cache);

    expect(manager).toBeInstanceOf(Manager);
    expect(manager.cache).toBe(cache);
  });
});

describe('linkFactory', () => {
  test('pass the Manager and create a Link', () => {
    const cache: any = 'cache';
    const manager = managerFactory(cache);
    const link = linkFactory(manager);

    expect(link).toBeInstanceOf(LoonaLink);
    expect(link.manager).toBe(manager);
  });
});

describe('LoonaModule', () => {
  describe('forRoot()', () => {
    class FooState {}
    const module = LoonaModule.forRoot([FooState]);

    test('use root module', () => {
      expect(module.ngModule).toBe(LoonaRootModule);
    });

    test('provide Loona', () => {
      expect(module.providers).toContain(Loona);
    });

    test('provide inner and scanned actions', () => {
      expect(module.providers).toContain(InnerActions);
      expect(module.providers).toContain(ScannedActions);
    });

    test('use ScannedActions as Actions', () => {
      expect(module.providers).toContainEqual({
        provide: Actions,
        useExisting: ScannedActions,
      });
    });

    test('provide effects', () => {
      expect(module.providers).toContain(Effects);
      expect(module.providers).toContain(EffectsRunner);
    });

    test('create manager', () => {
      expect(module.providers).toContainEqual({
        provide: Manager,
        useFactory: managerFactory,
        deps: [LOONA_CACHE],
      });
    });

    test('create link', () => {
      expect(module.providers).toContainEqual({
        provide: LoonaLink,
        useFactory: linkFactory,
        deps: [Manager],
      });
    });

    test('provide states', () => {
      expect(module.providers).toContain(FooState);
      expect(module.providers).toContainEqual({
        provide: INITIAL_STATE,
        useValue: [FooState],
      });
    });
  });

  describe('forChild()', () => {
    class FooState {}
    const module = LoonaModule.forChild([FooState]);

    test('use child module', () => {
      expect(module.ngModule).toBe(LoonaChildModule);
    });

    test('provide states', () => {
      expect(module.providers).toContain(FooState);
      expect(module.providers).toContainEqual({
        provide: CHILD_STATE,
        useValue: [FooState],
      });
    });

    test('not provide Loona, actions and effects', () => {
      expect(module.providers).not.toContain(Loona);
      expect(module.providers).not.toContain(Effects);
      expect(module.providers).not.toContain(EffectsRunner);
      expect(module.providers).not.toContain(InnerActions);
      expect(module.providers).not.toContain(ScannedActions);
    });
  });
});
