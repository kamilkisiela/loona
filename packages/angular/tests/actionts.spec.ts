import {getActionType, ScannedActions, InnerActions} from '../src/actions';
import {INIT} from '../src/tokens';

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

describe('ScannedActions', () => {
  test('should complete on ngOnDestroy', () => {
    const subject = new ScannedActions();

    expect(subject.isStopped).toEqual(false);
    subject.ngOnDestroy();
    expect(subject.isStopped).toEqual(true);
  });
});

describe('InnerActions', () => {
  let subject: InnerActions;

  beforeEach(() => {
    subject = new InnerActions();
  });

  afterEach(() => {
    subject.ngOnDestroy();
  });

  test('emit INIT as a first value', () => {
    expect(subject.getValue()).toEqual({type: INIT});
  });

  test('emit values', () => {
    subject.next({
      type: 'test',
    });
    expect(subject.getValue()).toEqual({type: 'test'});
  });

  test('prevent direct completion', () => {
    subject.complete();
    expect(subject.isStopped).toEqual(false);
  });

  test('complete on ngOnDestroy', () => {
    expect(subject.isStopped).toEqual(false);
    subject.ngOnDestroy();
    expect(subject.isStopped).toEqual(true);
  });

  test('throw on not defined', () => {
    expect(() => {
      (subject as any).next();
    }).toThrowError('Actions must be objects');
  });

  test('throw on not an object', () => {
    expect(() => {
      subject.next('string' as any);
    }).toThrowError('Actions must have a type property');
  });

  test(`throw on missing type property`, () => {
    expect(() => {
      subject.next({payload: 'test'} as any);
    }).toThrowError('Actions must have a type property');
  });
});
