import { Observable, from } from 'rxjs';
import { first } from 'rxjs/operators';

function wrapObservable(instance: any, propName: string) {
  return (...args: any[]) =>
    new Promise<any>((resolve, reject) => {
      let result: any;

      try {
        result = instance[propName].apply(instance, args);
      } catch (e) {
        reject(e);
      }

      if (isPromise(result) || isObservable(result)) {
        from(result)
          .pipe(first())
          .subscribe({
            next: resolve,
            error: reject,
          });
      } else {
        resolve(result);
      }
    });
}

export function isPromise<T = any>(val: any): val is Promise<T> {
  return val instanceof Promise;
}

export function isObservable<T = any>(val: any): val is Observable<T> {
  return val instanceof Observable;
}

export function isString(val: any): val is string {
  return typeof val === 'string';
}

export const createResolver = wrapObservable;
