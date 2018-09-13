import {Observable, from} from 'rxjs';

export function isObservable<T = any>(val: any): val is Observable<T> {
  return val instanceof Observable;
}

export function handleObservable(resolver: any) {
  return (...args: any[]) => {
    let result: any;

    try {
      result = resolver(...args);
    } catch (e) {
      return Promise.reject(e);
    }

    return result instanceof Promise || isObservable(result)
      ? from(result).toPromise()
      : Promise.resolve(result);
  };
}
