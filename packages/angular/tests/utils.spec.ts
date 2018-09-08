import {of, Observable} from 'rxjs';

import {handleObservable} from '../src/utils';

describe('handleObservable', () => {
  test('pass all arguments and call just once', () => {
    const spy = jest.fn();
    handleObservable(spy)(1, 2, 3);
    expect(spy).toHaveBeenCalledWith(1, 2, 3);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('handle a primitive value', async () => {
    expect(await handleObservable(() => 42)()).toEqual(42);
  });

  test('handle a promise', async () => {
    expect(await handleObservable(() => Promise.resolve(42))()).toEqual(42);
  });

  test('handle an Observable', async () => {
    expect(await handleObservable(() => of(42))()).toEqual(42);
  });

  test('resolve only when completed', async () => {
    expect(
      await handleObservable(
        () =>
          new Observable(observer => {
            observer.next(41);
            setTimeout(() => {
              observer.next(42);
              observer.complete();
            }, 50);
          }),
      )(),
    ).toEqual(42);
  });
});
