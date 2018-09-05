import {isPromise} from '@loona/core';
import {Observable, from} from 'rxjs';

export function handleObservable(resolver: any) {
  return (...args: any[]) => {
    let result: any;

    try {
      result = resolver(...args);
    } catch (e) {
      return Promise.reject(e);
    }

    return isPromise(result) || isObservable(result)
      ? from(result).toPromise()
      : Promise.resolve(result);
  };
}

export function isObservable<T = any>(val: any): val is Observable<T> {
  return val instanceof Observable;
}
