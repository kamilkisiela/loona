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

export function buildGetCacheKey(cache: any) {
  return (obj: {__typename: string; id: string | number}) => {
    if ((cache as any).config) {
      return (cache as any).config.dataIdFromObject(obj);
    } else {
      throw new Error(
        'To use context.getCacheKey, you need to use a cache that has a configurable dataIdFromObject, like apollo-cache-inmemory.',
      );
    }
  };
}
