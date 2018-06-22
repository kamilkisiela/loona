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

function isPromise(val: any): val is Promise<any> {
  return typeof val.then !== 'undefined';
}

function isObservable(val: any): val is Observable<any> {
  return typeof val.subscribe !== 'undefined';
}

export const createResolver = wrapObservable;
